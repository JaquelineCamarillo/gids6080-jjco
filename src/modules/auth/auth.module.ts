//auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../common/services/prisma.service';
import { UserService } from '../user/user.service';



@Module({
  imports: [ 
    JwtModule.register({
      global: true,
      
    }),
  ],
  providers: [AuthService, PrismaService,JwtService,UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
