import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config'; 
import { APP_FILTER } from '@nestjs/core';
import { AllException } from './common/filters/http-exception.filter';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule, 
    UserModule, 
    TaskModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: AllException,
    },
  ],
})
export class AppModule {}