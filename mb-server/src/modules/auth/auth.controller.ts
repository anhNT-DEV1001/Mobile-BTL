import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto } from './dto/req/auth.request';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/api';
import { LoginResponse, TokensResponse } from './dto/res/auth.response';
import { UserResponse } from '../user/dto/res/user.response';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/user-current.decorator';
import { CreateUserDto } from '../user/dto/req/user.request';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: 200,
        type: LoginResponse
    })
    async loginController(@Body() loginData: LoginDto): Promise<BaseResponse<LoginResponse>> {
        const response = await this.authService.login(loginData);
        return {
            status: 'success',
            message: 'Đăng nhập thành công !',
            data: response
        };
    }

    @Get('me')
    @ApiResponse({
        status: 200,
        type: UserResponse
    })
    async meController(@CurrentUser() user): Promise<BaseResponse<UserResponse>> {
        return {
            status: 'success',
            message: 'Lấy thông tin thành công !',
            data: user
        };
    }

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: 200,
        type: TokensResponse
    })
    async refreshController(@Body() data: RefreshDto): Promise<BaseResponse<TokensResponse>> {
        const response = await this.authService.refreshToken(data.userId, data.refreshToken);
        return {
            status: 'success',
            message: 'Refresh thành công',
            data: response
        };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: 200,
        type: UserResponse
    })
    async logoutController(@CurrentUser() user): Promise<BaseResponse<UserResponse>> {
        const response = await this.authService.logout(user.id);
        return {
            status: 'success',
            message: 'Đăng xuất thành công !',
            data: response
        }
    }

    @Public()
    @Post('register')
    @ApiResponse({
        status: 201,
        type: UserResponse
    })
    async registerController(@Body() userData: CreateUserDto): Promise<BaseResponse<UserResponse>> {
        const response = await this.authService.register(userData);
        return {
            status: 'success',
            message: 'Đăng ký thành công !',
            data: response
        }
    }
}
