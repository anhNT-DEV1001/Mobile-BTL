import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserResponse } from 'src/modules/user/dto/res/user.response';

export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        if (!data) {
            return request.user as UserResponse;
        }
        // nếu bạn muốn lấy 1 field cụ thể: vd CurrentUser('email')
        return request.user?.[data];
    },
);
