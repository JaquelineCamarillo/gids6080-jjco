import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../services/prisma.service';
import { pgProvider } from '../../common/providers/pg.provider';
import { UtilService } from '../../services/util.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, pgProvider[0], UtilService, AuthGuard, RolesGuard],
})
export class UserModule {}
