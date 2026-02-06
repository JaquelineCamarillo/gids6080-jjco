import { Controller } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { TaskService } from "./task.service";

@Controller("api/tasks")
export class TaskController {

    constructor(private taskSvc: TaskService) {}
        
        @Get()
        public task(): string {
            return this.taskSvc.task();
        }
} 