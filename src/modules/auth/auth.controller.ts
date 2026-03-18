//auth.controller.ts
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { UtilService } from 'src/common/services/util.service'; 
import { request } from 'https';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login to the application' })
  public async login(@Body() auth: AuthDto): Promise<any>{
    const user = await this.authSvc.getUserBYUsername(auth.username);
    if (!user)
      throw new UnauthorizedException('Invalid credentials');
    if (await this.utilSvc.checkPassword(auth.password)){
      
    }

  }

  @Get("Me")
  @ApiOperation({ summary: 'Get the current user' })
  @UseGuards(AuthGuard)
  public getProfile (@Req() request: any) {
    const user = request['user'];
    return user;
  }

}
 