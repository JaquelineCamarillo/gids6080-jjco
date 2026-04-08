import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaService } from '../../services/prisma.service'; // ✅ ruta corregida
import { Task } from '../task/entities/task.entity';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService, // ✅ eliminado @Inject('MYSQL_CONNECTION')
  ) {}

  public async getUsers(currentUserId: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        name: true,
        lastname: true,      // ✅ corregido de lastName
        username: true,
        created_dt: true,    // ✅ corregido de created_at
        refreshToken: true,  // ✅ agregado (requerido por User entity)
      },
      where: {
        id: { not: currentUserId }
      }
    });
    return users as User[];
  }

  public async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastname: true,      // ✅ corregido
        username: true,
        created_dt: true,    // ✅ corregido
        refreshToken: true,  // ✅ agregado
      },
    });
    return user as User | null;
  }

  public async getUserByUsername(username: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { username },
      select: {
        id: true,
        name: true,
        lastname: true,      // ✅ corregido
        username: true,
        created_dt: true,    // ✅ corregido
        refreshToken: true,  // ✅ agregado
      },
    });
    return users as User[];
  }

  public async getTasksByUser(id: number): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { user_id: id },
    });
  }

  public async insert(user: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: user,
      select: {
        id: true,
        name: true,
        lastname: true,      // ✅ corregido
        username: true,
        created_dt: true,    // ✅ corregido
        refreshToken: true,  // ✅ agregado
      },
    });
    return newUser as User;
  }

  public async update(id: number, userUpdate: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: userUpdate,
    });
    return user as User;
  }

  public async delete(id: number): Promise<Boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new Error('User not found');
    }
    return true;
  }
}