// src/modules/user/user.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  HttpException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entitie';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/user')
@ApiTags('Users')
export class UserController {
  constructor(private userSvc: UserService) { }

  /** Listar todos los usuarios — solo ADMIN. */
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  public async getUser(): Promise<User[]> {
    try {
      return await this.userSvc.getUsers();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener la lista de usuarios');
    }
  }

  /** Obtener un usuario por ID. */
  @Get(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  public async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    try {
      const user = await this.userSvc.getUserById(id);
      if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Ocurrió un error al buscar el usuario ${id}`);
    }
  }

  /** Crear un nuevo usuario. */
  @Post()
  @ApiOperation({ summary: 'Registrar un usuario nuevo' })
  public async insertUser(@Body() user: CreateUserDto): Promise<User> {
    try {
      const result = await this.userSvc.insertUser(user);
      if (!result) throw new InternalServerErrorException('El usuario no pudo ser registrado');
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error interno al registrar el usuario');
    }
  }

  /** Actualizar usuario. */
  @Put(':id')
  @UseGuards(AuthGuard)
  public async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    try {
      const existing = await this.userSvc.getUserById(id);
      if (!existing) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      return await this.userSvc.updateUser(id, user);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Error al actualizar el usuario con ID ${id}`);
    }
  }

  /**
   * Eliminar usuario — solo ADMIN.
   * Las tareas del usuario eliminado se reasignan automáticamente al admin
   * que ejecuta la acción, para que pueda redistribuirlas luego.
   * Un admin NO puede eliminarse a sí mismo.
   */
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  public async deleteUser(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ deleted: boolean; tasksReassigned: number; message: string }> {
    const adminId = request['user'].id;

    // Protección: el admin no puede eliminarse a sí mismo
    if (adminId === id) {
      throw new ForbiddenException('No puedes eliminarte a ti mismo');
    }

    try {
      const result = await this.userSvc.deleteUser(id, adminId);
      return {
        ...result,
        message: result.tasksReassigned > 0
          ? `Usuario eliminado. ${result.tasksReassigned} tarea(s) reasignada(s) a tu cuenta.`
          : 'Usuario eliminado exitosamente.',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
  }
}