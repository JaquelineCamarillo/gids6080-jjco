import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../services/prisma.service';
import { pgProvider } from '../../common/providers/pg.provider';
import { UtilService } from '../../services/util.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, pgProvider[0], UtilService],
})
export class AuthModule {}
