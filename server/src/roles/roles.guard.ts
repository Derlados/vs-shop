import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles.decorator";
import { RoleValues } from "./roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requireRoles = this.reflector.getAllAndOverride<RoleValues[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!requireRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest()
        return requireRoles.some((role) => user.roles?.includes(role));
    }

}