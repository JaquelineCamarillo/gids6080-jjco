//user.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,            // importado desde @nestjs/common
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UtilService } from '../../services/util.service';   // ✅ ruta corregida
import { AuthGuard } from '../../common/guards/auth.guard';  // ✅ ruta corregida

@Controller('api/users')
@ApiTags('User')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userSvc: UserService,
    private readonly utilSvc: UtilService,
  ) {}

  @Get()
  public async getUsers(@Req() request: any): Promise<User[]> { // ✅ typo corregido
    const user = request['user'];
    return await this.userSvc.getUsers(user.id);
  }

  @Get(':id')
  public async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    const result = await this.userSvc.getUserById(id);
    if (result == undefined)
      throw new HttpException(
        'Usuario con id: ' + id + ' no encontrado',
        HttpStatus.NOT_FOUND,
      );
    return result;
  }

  @Post()
  @ApiOperation({ summary: 'Insert a user in the db' })
  public insertUser(@Body() user: CreateUserDto): Promise<User> {
    const result = this.userSvc.insert(user);
    if (result == undefined)
      throw new HttpException('Usuario no registrado', HttpStatus.INTERNAL_SERVER_ERROR);
    return result;
  }

  @Put('/:id')
  public updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return this.userSvc.update(id, user);
  }

  @Delete(':id')
  public async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    const result = await this.userSvc.delete(id);
    if (!result)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return true;
  }
}
