import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PayLoadDto } from '../dto/req/auth.request';
import { UserService } from 'src/modules/user/user.service';
import { ApiError } from 'src/common/api';
import { UserResponse } from 'src/modules/user/dto/res/user.response';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService, private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('jwt.accessSecret'),
        });
    }

    async validate(payload: PayLoadDto): Promise<UserResponse> {
        const user = await this.userService.findUserById(payload.sub);
        if (!user) throw new ApiError('Lỗi xác thực thông tin người dùng !', HttpStatus.UNAUTHORIZED);
        return this.userService.toUserResponse(user);
    }
}