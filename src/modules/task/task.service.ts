import { Injectable } from "@nestjs/common";

@Injectable()
export class TaskService {

    public getTasks() {
        return "Tarea creada exitosamente";
    }

    public getTaskById(id: number): string {
        return `Tarea con el id: ${id}`;
    }

    public insert (task: any): string {
        return task;
    }

    public update (id: number, task: any): string {
        return task;
    }

    public delete (id: number): string {
        return `Tarea con el id: ${id} eliminada`;
    }
}