import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { PrismaService } from '../../services/prisma.service'; // ✅ ruta corregida
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService, // ✅ eliminado @Inject('MYSQL_CONNECTION')
  ) {}

  public async getTasks(): Promise<Task[]> {
    return await this.prisma.task.findMany() as Task[];
  }

  public async getTaskById(id: number): Promise<Task | null> {
    return await this.prisma.task.findUnique({
      where: { id },
    }) as Task | null;
  }

  public async insert(task: CreateTaskDto): Promise<Task> {
    return await this.prisma.task.create({
      data: task,
    }) as Task;
  }

  public async update(id: number, taskUpdate: UpdateTaskDto): Promise<Task> {
    return await this.prisma.task.update({
      where: { id },
      data: taskUpdate,
    }) as Task;
  }

  public async delete(id: number): Promise<Task> {
    return await this.prisma.task.delete({
      where: { id },
    }) as Task;
  }
}