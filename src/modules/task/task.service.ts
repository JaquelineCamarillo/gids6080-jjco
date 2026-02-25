import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { promises } from 'dns';
import { error } from 'console';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Injectable()
export class TaskService {
  constructor(@Inject('MYSQL_CONNECTION') private db: any) {}

  private tasks: any[] = [];

  public getTasks(): Promise<any> {
    const query = 'SELECT * FROM tasks';
    const [result]: any = this.db.query(query);

    return result;
  }



  public async getTaskById(id: number): Promise<any> {
    const query = 'SELECT * FROM tasks WHERE id = ';
    const result = await this.db.query(query, [id]);
    return result.rows[0] ;
  }



  public async insert(task: CreateTaskDto): Promise<any> {
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




  public async update(id: number, taskUpdate: any): Promise<any> {
    const task = await this.getTaskById(id);
    
    task.name = taskUpdate.name ? taskUpdate.name : task.name;
    task.description = taskUpdate.description ??  task.description;
    task.priority = taskUpdate.priority ? taskUpdate.priority : task.priority;


    //Convertir el objeto a un SET
    //{name : 'abc', description: 'abc'}
    //name =  '', description = ''
    const set = Object.keys(taskUpdate)
    .map((key) => `${key} = '${taskUpdate[key]}'`)
    .join(', ');
  }



  public delete(id: number): string {
    const array = this.tasks.filter((t) => t.id !== id);
    this.tasks = array;
    return 'Tarea eliminada correctamente';
  }
}
