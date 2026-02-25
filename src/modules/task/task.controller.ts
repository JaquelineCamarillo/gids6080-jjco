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

@Controller('api/tasks')
//@UsePipes(ValidationPipe) realizar un pipe de manera interna
export class TaskController {
  constructor(private taskSvc: TaskService) {}



  @Get()
  public async getTasks(): Promise<any[]> {
    return await this.taskSvc.getTasks();
  }



  @Get(':id')
  public async getTasksById( @Param('id', ParseIntPipe) id: number): Promise<any> {
    const result = await this.taskSvc.getTaskById(id);
    console.log("resultado", result);
    
    if (result == undefined)
      //throw new NotFoundException("Tarea con id: " + id + " no encontrada");
      throw new HttpException ("Tarea con id: " + id + " no encontrada", HttpStatus.NOT_FOUND);

    return result;
  }

  @Post()
  public insertTask(@Body() task: CreateTaskDto){
    const result = this.taskSvc.insert(task);

    if(result == undefined)
      throw new HttpException ("Tarea no registrada ", HttpStatus.INTERNAL_SERVER_ERROR);

    return result;
  }



  @Put('/:id')
  public updateTask(@Param('id', ParseIntPipe) id: number, @Body() task: UpdateTaskDto) {
    return this.taskSvc.update(id, task);
  }


  
  @Delete(':id')
  public deleteTask(@Param(':id') id: string) {
    return this.taskSvc.delete(parseInt(id));
  }
}
