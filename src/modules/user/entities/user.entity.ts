//user.entity.ts
import { Task } from "../../task/entities/task.entity";

// user.entity.ts
export class User {
  id!: number;
  name!: string;
  lastname!: string;
  username!: string;
  password?: string;
  hash?: string;
  created_dt!: Date;
  refreshToken!: string;
  rol_id?: number | null;
}
