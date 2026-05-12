import { IsDate, IsOptional, IsString } from "class-validator";


export class UpdateUserDto{
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    lastname?: string;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    password?: string;

}