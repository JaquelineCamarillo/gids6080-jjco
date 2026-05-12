//auth.service.ts
import { Injectable, NotFoundException, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { UtilService } from '../../services/util.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly utilSvc: UtilService,
    private readonly jwtService: JwtService
  ) { }

  async login(loginDto: AuthDto): Promise<any> {
    const { username, password } = loginDto;
    console.log(`Intento de login con username: "${username}"`);

    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { rol: true },
    });

    if (!user) {
      console.log('Login fallido: Usuario no existe');
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const isPasswordValid = await this.utilSvc.checkPassword(password, user.password);

    if (!isPasswordValid) {
      console.log('Login fallido: Contraseña incorrecta');
      throw new UnauthorizedException('Credenciales invalidas');
    }

    console.log('Login exitoso para:', username);

    const payload = await this.utilSvc.getPayload(user);
    const accessToken = await this.utilSvc.generateToken(payload, '1h');
    const refreshToken = await this.utilSvc.generateToken(payload, '7d');
    const hash = await this.utilSvc.hash(refreshToken);
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { hash: hash, refreshToken: refreshToken }
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        username: user.username,
        created_dt: user.created_dt,
        rol_id: user.rol_id,
        rol: user.rol,
      }
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const { name, lastname, username, password } = registerDto;
    
    console.log(`Intento de registro para username: "${username}"`);

    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.prisma.user.findUnique({
        where: { username }
      });

      if (existingUser) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }

      // Validar longitud de contraseña
      if (password.length < 6) {
        throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
      }

      // Hash de la contraseña
      const passwordHash = await this.utilSvc.hash(password);

      // Verificar si existe el rol EMPLOYEE (id: 2)
      let employeeRole = await this.prisma.rol.findUnique({
        where: { id: 2 }
      });

      // Si no existe el rol EMPLOYEE, crearlo
      if (!employeeRole) {
        console.log('Creando rol EMPLOYEE...');
        employeeRole = await this.prisma.rol.create({
          data: {
            id: 2,
            description: 'EMPLOYEE',
            status: true
          }
        });
      }

      // Crear usuario
      const user = await this.prisma.user.create({
        data: {
          name,
          lastname,
          username,
          password: passwordHash,
          refreshToken: '',
          created_dt: new Date(),
          rol_id: 2, // EMPLOYEE
        },
        include: { rol: true },
      });

      console.log('Usuario creado exitosamente:', username);

      // Generar tokens
      const payload = await this.utilSvc.getPayload(user);
      const accessToken = await this.utilSvc.generateToken(payload, '1h');
      const refreshToken = await this.utilSvc.generateToken(payload, '7d');
      const hash = await this.utilSvc.hash(refreshToken);
      
      await this.prisma.user.update({
        where: { id: user.id },
        data: { hash: hash, refreshToken: refreshToken }
      });

      return {
        access_token: accessToken,
        user: {
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          username: user.username,
          created_dt: user.created_dt,
          rol_id: user.rol_id,
          rol: user.rol,
        }
      };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  public async getUserById(id: number): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { rol: true },
    });
  }

  public async updateHash(user_id: number, hash: string | null): Promise<any> {
    return await this.prisma.user.update({
      where: { id: user_id },
      data: { hash }
    });
  }
}