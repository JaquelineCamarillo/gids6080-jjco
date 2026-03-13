import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString({ message: "name es requerido" })
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    @ApiProperty({ description: "name", example: "Jose" })
    name: string;

    @IsString({ message: "lastName es requerido" })
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    @ApiProperty({ description: "lastName", example: "Garcia" })
    lastName: string;

    @IsString({ message: "username es requerido" })
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    @ApiProperty({ description: "username", example: "josegarcia" })
    username: string;

    @IsString({ message: "password es requerida" })
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(255)
    @ApiProperty({ description: "password", example: "secret123" })
    password: string;
}