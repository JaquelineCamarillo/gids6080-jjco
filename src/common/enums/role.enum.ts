/**
 * Roles disponibles en la aplicación.
 * Se usa para proteger rutas con @Roles() + RolesGuard.
 */
//src/common/enums/role.enum.ts
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
