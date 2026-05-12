// src/modules/task/dto/create-task.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import {
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    MinLength
} from "class-validator";

export class CreateTaskDto {
    @IsString({ message: "El nombre debe ser un texto" })
    @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
    @MaxLength(50, { message: "El nombre no debe exceder los 50 caracteres" })
    name!: string;

    @IsString({ message: "La descripción debe ser un texto" })
    @MinLength(3, { message: "La descripción debe tener al menos 3 caracteres" })
    @MaxLength(250, { message: "La descripción no debe exceder los 250 caracteres" })
    description!: string;

    @IsBoolean()
    priority!: boolean;

    // Solo el admin puede enviarlo; si no viene, el backend usa el id del token
    @IsOptional()
    @IsInt({ message: "El ID de usuario debe ser un número entero" })
    user_id?: number;
}