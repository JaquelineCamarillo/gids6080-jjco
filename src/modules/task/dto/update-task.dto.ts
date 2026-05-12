// src/modules/task/dto/update-task.dto.ts
import {
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";

export class UpdateTaskDto {
    @IsOptional()
    @IsString({ message: "El nombre debe ser un texto" })
    @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
    @MaxLength(50, { message: "El nombre no debe exceder los 50 caracteres" })
    name?: string;

    @IsOptional()
    @IsString({ message: "La descripción debe ser un texto" })
    @MinLength(3, { message: "La descripción debe tener al menos 3 caracteres" })
    @MaxLength(250, { message: "La descripción no debe exceder los 250 caracteres" })
    description?: string;

    @IsOptional()
    @IsBoolean()
    priority?: boolean;

    // Permite al admin reasignar la tarea a otro usuario
    @IsOptional()
    @IsInt({ message: "El ID de usuario debe ser un número entero" })
    user_id?: number;
}