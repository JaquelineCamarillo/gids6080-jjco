import { Task } from "src/modules/task/entities/task.entity";

export class User{
    id: number;
    name: string;
    lastName: string;
    username: string;
    password?: string;
    created_at: Date;
}


