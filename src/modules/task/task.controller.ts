// src/modules/task/task.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/task')
@ApiTags('Tareas')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskSvc: TaskService) { }

  /**
   * Obtener tareas:
   * - ADMIN: obtiene TODAS las tareas de todos los usuarios.
   * - USER: obtiene solo sus propias tareas.
   */
  @Get()
  public async getTask(@Req() request: any): Promise<Task[]> {
    const user = request['user'];
    if (user.role === Role.ADMIN) {
      return await this.taskSvc.getAllTasks();
    }
    return await this.taskSvc.getTasks(user.id);
  }

  /** Obtener una tarea por ID. */
  @Get(':id')
  @HttpCode(200)
  public async getTaskById(@Req() request: any, @Param('id', ParseIntPipe) id: number): Promise<Task> {
    const user = request['user'];
    const ownerId = user.role === Role.ADMIN ? 0 : user.id;
    const task = await this.taskSvc.getTaskById(id, ownerId);

    if (!task) {
      throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    }
    return task;
  }

  /**
   * Crear tarea:
   * - ADMIN: puede enviar user_id en el body para asignar a cualquier usuario.
   * - USER: siempre se asigna a sí mismo (se ignora user_id si lo envía).
   */
  @Post()
  @ApiOperation({ summary: 'Crear una tarea (admin puede asignar a cualquier usuario)' })
  public async insertTask(@Req() request: any, @Body() task: CreateTaskDto): Promise<Task> {
    const user = request['user'];

    let targetUserId: number;
    if (user.role === Role.ADMIN && task.user_id) {
      targetUserId = task.user_id;
    } else {
      targetUserId = user.id;
    }

    const result = await this.taskSvc.insertTask(task, targetUserId);

    if (!result) {
      throw new HttpException('Tarea no registrada', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result;
  }

  /**
   * Actualizar tarea:
   * - ADMIN: puede actualizar cualquier tarea y reasignarla.
   * - USER: solo sus propias tareas.
   */
  @Put(':id')
  public async updateTask(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateTaskDto,
  ): Promise<Task> {
    const user = request['user'];
    const ownerId = user.role === Role.ADMIN ? 0 : user.id;
    return await this.taskSvc.updateTask(id, ownerId, task);
  }

  /**
   * Eliminar tarea:
   * - ADMIN: puede eliminar cualquier tarea.
   * - USER: solo sus propias tareas.
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  public async deleteTask(@Req() request: any, @Param('id', ParseIntPipe) id: number): Promise<boolean> {
    try {
      const user = request['user'];
      const ownerId = user.role === Role.ADMIN ? 0 : user.id;
      await this.taskSvc.deleteTask(id, ownerId);
    } catch (error) {
      throw new HttpException('Tarea no encontrada', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}