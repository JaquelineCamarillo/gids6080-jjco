import {
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    Matches,
    IsAlphanumeric
} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
    name!: string;

    @IsString()
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El apellido no puede exceder los 50 caracteres' })
    lastname!: string;

    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    @IsAlphanumeric('es-ES', { message: 'El username solo puede contener letras y números' })
    @MinLength(4, { message: 'El username debe tener al menos 4 caracteres' })
    @MaxLength(20, { message: 'El username no puede exceder los 20 caracteres' })
    username!: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(50, { message: 'La contraseña es demasiado larga' })
    // Esta expresión regular obliga a que haya al menos una mayúscula, una minúscula y un número
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número',
    })
    password!: string;
}