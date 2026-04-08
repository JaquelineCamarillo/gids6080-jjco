export class Task {
  id!: number;
  name!: string;
  description!: string;
  priority!: boolean;
  created_dt!: Date;  // ✅ corregido de created_at
  user_id!: number;
}