import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, maxLength, MinLength, minLength } from "class-validator";

export class CreateTaskDto {

    @IsString( { message: "nombre es requerido" } )
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    @ApiProperty({ description: "name", example: "Jose" }) 
    name: string;

    @IsString( { message: "nombre es requerido" } )
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(250)
    @IsNotEmpty()
    @ApiProperty({ description: "description", example: "This es description" })
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: "priority", example: false })
    priority: boolean;

    @IsNumber()
    @IsInt()
    @ApiProperty({ description: "user_id", example: 1 })
    user_id: number;
}