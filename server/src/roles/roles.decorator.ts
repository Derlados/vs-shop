import { SetMetadata } from "@nestjs/common";
import { RoleValues } from "./roles.enum";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleValues[]) => SetMetadata(ROLES_KEY, roles);