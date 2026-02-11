import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('api/tasks')
export class TaskController {
  constructor(private taskSvc: TaskService) {}

  @Get()
  public getTasks(): any[] {
    return this.taskSvc.getTasks();
  }

  @Get(":id")
  public getTasksById(@Param("id", ParseIntPipe) id: number): any {
    console.log(typeof id);
    return this.taskSvc.getTaskById(id);
  }

  @Post()
  public insertTask(@Body() task: CreateTaskDto): string {
    return this.taskSvc.insert(task);
  }

  @Put("/:id")
  public updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: any) {
    return this.taskSvc.update(id, task);
  }

  @Delete(":id")
  public deleteTask(@Param(":id") id: string) {
    return this.taskSvc.delete(parseInt(id));
  }
}
