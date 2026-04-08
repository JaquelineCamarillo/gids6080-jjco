import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaService } from '../../services/prisma.service'; // 

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService], // ✅ solo Prisma
})
export class TaskModule {}