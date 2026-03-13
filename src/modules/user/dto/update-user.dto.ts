import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {

    @IsString({ message: "name es requerido" })
    @IsOptional()
    @MinLength(3)
    @MaxLength(100)
    name?: string;

    @IsString({ message: "lastName es requerido" })
    @IsOptional()
    @MinLength(3)
    @MaxLength(100)
    lastName?: string;

    @IsString({ message: "username es requerido" })
    @IsOptional()
    @MinLength(3)
    @MaxLength(50)
    username?: string;

    @IsString({ message: "password es requerida" })
    @IsOptional()
    @MinLength(6)
    @MaxLength(255)
    password?: string;
}