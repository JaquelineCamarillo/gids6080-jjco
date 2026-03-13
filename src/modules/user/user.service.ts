import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/common/services/prisma.service';
import { Task } from '../task/entities/task.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('MYSQL_CONNECTION') private db: any,
    private prisma: PrismaService,
  ) {}

  public async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        password: false,
        created_at: true,
      },
    });
    return users;
  }

  public async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        password: false,
        created_at: true,
      },
    });
    return user;
  }

  public async getUserByUsername(username: string): Promise<User[]> {
    const user = await this.prisma.user.findMany({
      where: { username },
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        password: false,
        created_at: true,
      },
    });
    return user;
  }

  public async getTasksByUser(id: number): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { user_id: id },
    });
    return tasks;
  }

  public async insert(user: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: user,
      select: {
        id: true,
        name: true,
        lastName: true,
        username: true,
        password: false,
        created_at: true,
      },
    });
    return newUser;
  }

  public async update(id: number, userUpdate: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: userUpdate,
    });
    return user;
  }

  public async delete(id: number): Promise<Boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error('User not found');
    }
    return true;
  }
}
