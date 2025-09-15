import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/req/user.request';
import { UserResponse } from './dto/res/user.response';
import { BaseResponse } from 'src/common/api';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/enums';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }
    @Post()
    @ApiResponse({
        status: 201,
        type: UserResponse
    })
    async createUserController(@Body() userData: CreateUserDto): Promise<BaseResponse<UserResponse>> {
        const response = await this.userService.createUser(userData);
        return {
            status: 'success',
            message: 'Tạo người dùng thành công !',
            data: response
        };
    }

    @Get()
    @ApiResponse({
        status: 200,
        type: [UserResponse]
    })
    @Roles(UserRole.ADMIN)
    async findAllUserController(): Promise<BaseResponse<UserResponse[]>> {
        const res = await this.userService.findAll();
        return {
            status: 'success',
            message: 'Lấy danh sách người dùng thành công !',
            data: res
        }
    }



    @Patch(':id')
    @ApiResponse({
        status: 200,
        type: UserResponse
    })
    async updateUserController(
        @Param() id: string,
        @Body() userData: UpdateUserDto
    ): Promise<BaseResponse<UserResponse>> {
        const response = await this.userService.updateUser(id, userData);
        return {
            status: 'success',
            message: 'Cập nhật người dùng thành công !',
            data: response
        }
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        type: UserResponse
    })
    async deleteUserController(@Param() id: string): Promise<BaseResponse<UserResponse>> {
        const response = await this.userService.deleteUser(id);
        return {
            status: 'success',
            message: 'Xóa người dùng thành công !',
            data: response
        }
    }
}
