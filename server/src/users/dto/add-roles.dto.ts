import { IsArray, IsEnum } from "class-validator";
import { RoleValues } from "src/roles/roles.enum";

export class AddRolesDto {
    @IsArray()
    @IsEnum(RoleValues, { each: true })
    roles: RoleValues[];
}