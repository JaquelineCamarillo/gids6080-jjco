// src/modules/user/user.service.ts
import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { User } from './entities/user.entitie';
import { UpdateUserDto } from './dto/update-user.dto';
import { Task } from '../task/entities/task.entity';
import { UtilService } from '../../services/util.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {

  constructor(
    @Inject('PG_CONNECTION') private db: any,
    private prisma: PrismaService,
    private readonly utilSvc: UtilService
  ) { }

  login(): string {
    return 'Autenticación correcta';
  }

  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: [{ name: 'asc' }],
      include: { rol: true },
    });
    return users.map(({ password, hash, refreshToken, ...safe }) => safe as any);
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { rol: true },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const { password, hash, refreshToken, ...safe } = user;
    return safe as any;
  }

  async insertUser(user: CreateUserDto) {
    const { username, password, ...restOfUser } = user;

    const sameUser = await this.prisma.user.findUnique({ where: { username } });
    if (sameUser) {
      throw new ConflictException(`El usuario con el username '${username}' ya existe`);
    }

    const encryptedPassword = await this.utilSvc.hash(password);

    const defaultRol = await this.prisma.rol.findFirst({
      where: { description: 'EMPLOYEE' },
    });

    const newUser = await this.prisma.user.create({
      data: {
        ...restOfUser,
        username,
        password: encryptedPassword,
        rol_id: defaultRol?.id,
        refreshToken: '',
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        created_dt: true,
      },
    });

    return newUser;
  }

  async updateUser(id: number, userUpdate: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: userUpdate,
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        created_dt: true,
      },
    });
    return user as any;
  }

  /**
   * Eliminar usuario en transacción:
   * 1. Reasigna todas las tareas del usuario eliminado al admin que ejecuta la acción.
   * 2. Elimina los logs del usuario.
   * 3. Elimina al usuario.
   *
   * Las tareas NO se pierden — quedan en poder del admin para reasignarlas luego.
   *
   * @param id       ID del usuario a eliminar
   * @param adminId  ID del admin que ejecuta la eliminación (recibe las tareas)
   */
  async deleteUser(id: number, adminId: number): Promise<{ deleted: boolean; tasksReassigned: number }> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    let tasksReassigned = 0;

    await this.prisma.$transaction(async (tx) => {
      // 1. Reasignar tareas del usuario al admin
      const result = await tx.task.updateMany({
        where: { user_id: id },
        data:  { user_id: adminId },
      });
      tasksReassigned = result.count;

      // 2. Eliminar logs del usuario (no tienen uso sin el usuario)
      await tx.logs.deleteMany({ where: { sesion_id: id } });

      // 3. Eliminar al usuario
      await tx.user.delete({ where: { id } });
    });

    return { deleted: true, tasksReassigned };
  }

  async getTaskByUser(id: number): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { user_id: id },
    });
  }
}