import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';  

/** Clave usada para leer la metadata de roles en RolesGuard */
export const ROLES_KEY = 'roles';

/**
 * Decorador para marcar un controlador o método con los roles permitidos.
 * @example @Roles(Role.ADMIN)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
