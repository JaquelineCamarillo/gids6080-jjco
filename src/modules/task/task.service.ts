import { Injectable } from "@nestjs/common";

@Injectable()
export class TaskService {

    task(): string {
        return 'Tarea creada exitosamente';
    }
}