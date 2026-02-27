import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { isUndefined } from 'util';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller('api/tasks')
@ApiTags("Task")
//@UsePipes(ValidationPipe) realizar un pipe de manera interna
export class TaskController {
  constructor(private taskSvc: TaskService) {}



  @Get()
  public async getTasks(): Promise<any> {
    return await this.taskSvc.getTasks();
  }



  @Get(":id")
  public async getTasksById( @Param('id', ParseIntPipe) id: number): Promise<Task> {
    const result = await this.taskSvc.getTaskById(id);
    
    if (result == undefined)
      //throw new NotFoundException("Tarea con id: " + id + " no encontrada");
      throw new HttpException ("Tarea con id: " + id + " no encontrada", HttpStatus.NOT_FOUND);

    return result;
  }

  @Post()
  @ApiOperation({summary:'Insert a task in the db'})
  public insertTask(@Body() task: CreateTaskDto): Promise<Task> {
    const result = this.taskSvc.insert(task);

    if(result == undefined)
      throw new HttpException ("Tarea no registrada ", HttpStatus.INTERNAL_SERVER_ERROR);

    return result;
  }



  @Put("/:id")
  public updateTask(@Param('id', ParseIntPipe) id: number, @Body() task: UpdateTaskDto): Promise<Task> {
    return this.taskSvc.update(id, task);
  }


  
  @Delete(":id")
  public async deleteTask(@Param('id',ParseIntPipe) id: number): Promise<boolean> {
    const result = await this.taskSvc.delete(id);

    if (!result)
      // FIX : Devolver un codigo de estado
    throw new HttpException("No se puede eliminar la tarea", HttpStatus.NOT_FOUND);

    return result;
  }
}
