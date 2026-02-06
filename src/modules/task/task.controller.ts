import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { TaskService } from "./task.service";

@Controller("api/tasks")
export class TaskController {

    constructor(private taskSvc: TaskService) {}
        
        @Get()
        public getTasks(): string {
            return this.taskSvc.getTasks();
        }
        @Get(":id")
        public getTasksById(@Param("id") id: string): string {
            return this.taskSvc.getTaskById(parseInt(id));
        }
        
        @Post() 
        public insertTask(@Body() task: any): string {
            return this.taskSvc.insert(task);
        }

        @Put()
        public updateTask(@Body("id") id:string,@Body() task:any ) {
            return this.taskSvc.update(parseInt(id), task);
        }

        @Delete(":id")
        public deleteTask(@Param("id") id:string ) {
            return this.taskSvc.delete(parseInt(id));
        }
} 