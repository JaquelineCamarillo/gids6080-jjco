//auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  UseGuards,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AppException } from '../../common/exceptions/app.exception';

@Controller('api/auth')
export class AuthController {
  constructor(private authSvc: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: AuthDto): Promise<any> {
    return this.authSvc.login(loginDto);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Extrae el id del usuario desde el token y busca la información',
  })
  @UseGuards(AuthGuard)
  public getProfile() {}

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async refreshToken(@Req() request: any) {
    const userSession = request.user;
    const user = await this.authSvc.getUserById(userSession.id);

    if (!user || !user.hash)
      throw new AppException('Acceso denegado', HttpStatus.FORBIDDEN, '0');

    if (userSession.hash != user.hash)
      throw new AppException('Token invalido', HttpStatus.FORBIDDEN, '1');

    return { access_token: '', refreshToken: '' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(@Req() request: any) {
    const userSession = request.user;
    return await this.authSvc.updateHash(userSession.id, null);
  }
}
