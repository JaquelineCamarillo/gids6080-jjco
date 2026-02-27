import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { promises } from 'dns';
import { error } from 'console';
import { errorContext } from 'rxjs/internal/util/errorContext';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(@Inject('MYSQL_CONNECTION') private db: any) {}

  private tasks: any[] = [];

  public async getTasks(): Promise<any> {
    const query = 'SELECT * FROM tasks';
    const [rows]: any = await this.db.query(query); // ✅ await
  return rows;
  }



  public async getTaskById(id: number): Promise<Task> {
    const query = `SELECT * FROM tasks WHERE id = ${ id }`;
    const [rows] = await this.db.query(query);
    return rows[0];

  }



  public async insert(task: CreateTaskDto): Promise<Task> {
    //agregar el query
    const sql = `INSERT INTO tasks (name, description, priority, user_id) 
    VALUES ('${task.name}', '${task.description}', ${task.priority}, ${task.user_id})`;
    
    console.log(sql);

    const [result] = await this.db.query(sql);
    const insertId = result.insertId;

    console.log(insertId);
    console.log (errorContext)

    const row = await this.getTaskById(insertId);
    return row;
  }




  public async update(id: number, taskUpdate: any): Promise<Task> {
    const task = await this.getTaskById(id);
    
    task.name = taskUpdate.name ? taskUpdate.name : task.name;
    task.description = taskUpdate.description ??  task.description;
    task.priority = taskUpdate.priority ?? task.priority;


    const query = `
    UPDATE tasks
    SET name = '${ task.name }',
    description = '${ task.description }', 
    priority = ${ task.priority } 
    WHERE id = ${ task.id }`;

    await this.db.query(query);

    return await this.getTaskById(id);

  }



  public async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM tasks WHERE id = ${ id }`;
    const [result] = await this.db.query(query);

    return result.affectedRows > 0;

  }

}
