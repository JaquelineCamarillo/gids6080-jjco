// src/modules/task/task.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../../services/prisma.service';

@Injectable()
export class TaskService {

  constructor(@Inject('PG_CONNECTION') private db: any, private prisma: PrismaService) { }

  /** Todas las tareas de todos los usuarios (solo admin). */
  async getAllTasks(): Promise<Task[]> {
    return await this.prisma.task.findMany({
      include: { user: true },
      orderBy: { created_dt: 'desc' },
    });
  }

  /** Tareas de un usuario específico. */
  async getTasks(user_id: number): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { user_id },
      orderBy: { created_dt: 'desc' },
    });
  }

  /**
   * Obtener tarea por ID.
   * Si owner_id es 0 (admin), no filtra por usuario.
   */
  async getTaskById(id: number, owner_id: number): Promise<Task> {
    const where = owner_id === 0 ? { id } : { id, user_id: owner_id };
    const task = await this.prisma.task.findUnique({ where });

    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
    return task;
  }

  /** Crear tarea asignada al user_id indicado. */
  async insertTask(task: CreateTaskDto, user_id: number): Promise<Task> {
    const { user_id: _, ...taskData } = task; // excluir user_id del body
    return await this.prisma.task.create({
      data: { ...taskData, user_id },
      include: { user: true },
    });
  }

  /**
   * Actualizar tarea.
   * Si owner_id es 0 (admin), puede actualizar cualquier tarea.
   */
  async updateTask(id: number, owner_id: number, taskUpdate: UpdateTaskDto): Promise<Task> {
    const where = owner_id === 0 ? { id } : { id, user_id: owner_id };
    return await this.prisma.task.update({
      where,
      data: taskUpdate,
      include: { user: true },
    });
  }

  /**
   * Eliminar tarea.
   * Si owner_id es 0 (admin), puede eliminar cualquier tarea.
   */
  async deleteTask(id: number, owner_id: number): Promise<boolean> {
    const where = owner_id === 0 ? { id } : { id, user_id: owner_id };
    const deleted = await this.prisma.task.delete({ where });
    return !!deleted;
  }
}