import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, maxLength, MinLength, minLength } from "class-validator";

export class CreateTaskDto {

    @IsString( { message: "nombre es requerido" } )
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @IsString( { message: "nombre es requerido" } )
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(250)
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    priority: boolean;

    @IsNumber()
    @IsInt()
    user_id: number;
}