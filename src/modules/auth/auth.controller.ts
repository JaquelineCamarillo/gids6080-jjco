// src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  UseGuards,
  HttpStatus,
  Req
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AppException } from '../../common/exceptions/app.exception';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../services/prisma.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authSvc: AuthService,
    private prisma: PrismaService
  ) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: AuthDto): Promise<any> {
    return this.authSvc.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return this.authSvc.register(registerDto);
  }

  /** Ruta original */
  @Get('me')
  @ApiOperation({ summary: 'Extrae el id del usuario desde el token y busca la informacion' })
  @UseGuards(AuthGuard)
  public getMe(@Req() request: any) {
    return this.authSvc.getUserById(request.user.id);
  }

  /** Alias requerido por el AuthContext del frontend */
  @Get('profile')
  @ApiOperation({ summary: 'Alias de /me — verifica token y retorna el perfil' })
  @UseGuards(AuthGuard)
  public getProfile(@Req() request: any) {
    return this.authSvc.getUserById(request.user.id);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async refreshToken(@Req() request: any) {
    const userSession = request.user;
    const user = await this.authSvc.getUserById(userSession.id);

    if (!user || !user.hash) throw new AppException('Acceso denegado', HttpStatus.FORBIDDEN, '0');
    if (userSession.hash != user.hash) throw new AppException('Token invalido', HttpStatus.FORBIDDEN, '1');

    return {
      access_token: '',
      refreshToken: ''
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(@Req() request: any) {
    const userSession = request.user;
    const user = await this.authSvc.updateHash(userSession.id, null);
    return user;
  }

  @Post('setup-admin')
  async setupAdmin() {
    const existingAdmin = await this.prisma.user.findFirst({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      return {
        message: 'Admin already exists',
        user: {
          id: existingAdmin.id,
          username: existingAdmin.username,
          name: existingAdmin.name,
          lastname: existingAdmin.lastname,
        }
      };
    }

    const passwordHash = await bcrypt.hash('Admin123!', 10);

    const admin = await this.prisma.user.create({
      data: {
        name: 'Admin',
        lastname: 'System',
        username: 'admin',
        password: passwordHash,
        refreshToken: '',
        created_dt: new Date(),
        rol_id: 1,
      },
    });

    return {
      message: 'Admin created successfully',
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        lastname: admin.lastname,
      }
    };
  }
}