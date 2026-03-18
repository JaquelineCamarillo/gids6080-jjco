//auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/services/prisma.service';
import { AuthPayload, AuthTokens } from './interfaces/auth.interface';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  public async getUserBYUsername(username: string) {
    return await this.prisma.user.findFirst({
      where: { username },
    });
  }
}