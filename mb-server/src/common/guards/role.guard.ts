import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { ApiError } from '../api';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(ctx: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [ctx.getHandler(), ctx.getClass()],
        );
        if (!requiredRoles) {
            return true;
        }

        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (!user) throw new ApiError('Không tìm thấy người dùng !', HttpStatus.FORBIDDEN);
        if (!requiredRoles.includes(user.role)) {
            throw new ApiError('Bạn không có quyền truy cập !', HttpStatus.FORBIDDEN);
        }

        return true;
    }
}
