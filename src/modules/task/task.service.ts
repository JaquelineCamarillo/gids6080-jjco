import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { promises } from 'dns';
import { error } from 'console';
import { errorContext } from 'rxjs/internal/util/errorContext';
import { Task } from './entities/task.entity';
import { PrismaService } from 'src/common/services/prisma.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject('MYSQL_CONNECTION') private db: any,
    private prisma: PrismaService,
  ) {}

  public async getTasks(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany();

    return tasks;
  }

  public async getTaskById(id: number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    return task;
  }

  public async insert(task: CreateTaskDto): Promise<Task> {
    const newTask = await this.prisma.task.create({
      data: task,
    });
    return newTask;
  }

  public async update(id: number, taskUpdate: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.update({
      where: { id },
      data: taskUpdate,
    });
    return task;
  }

  public async delete(id: number): Promise<Task> {
    const task = await this.prisma.task.delete({
      where: { id },
    });
    return task;
  }
}
