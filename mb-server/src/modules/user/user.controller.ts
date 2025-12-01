import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/req/user.request';
import { UserResponse } from './dto/res/user.response';
import { BaseResponse } from 'src/common/api';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { BearerType, UserRole } from 'src/common/enums';
import { CurrentUser } from 'src/common/decorators/user-current.decorator';

@ApiTags('Users')
@ApiBearerAuth(BearerType.AccessToken)
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
    @ApiParam({ name: 'id', description: 'User ID' })
    async updateUserController(
        @Param('id') id: string,
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
    @ApiParam({ name: 'id', description: 'User ID' })
    async deleteUserController(@Param('id') id: string): Promise<BaseResponse<UserResponse>> {
        const response = await this.userService.deleteUser(id);
        return {
            status: 'success',
            message: 'Xóa người dùng thành công !',
            data: response
        }
    }
    @Get('bmi')
    @ApiResponse({
        status: 200,
        type: UserResponse
    })
    async getBMIController(@CurrentUser() user): Promise<BaseResponse<any>> {
        const response = await this.userService.userBmi(user);
        return {
            status: 'success',
            message: 'Lấy BMI thành công!',
            data: response
        }
    }
    @Get('energy-needs')
    @ApiResponse({
        status: 200,
        description: 'Trả về BMR và nhu cầu năng lượng hàng ngày (TDEE)'
    })
    async getEnergyNeedsController(@CurrentUser() user): Promise<BaseResponse<any>> {
        const response = await this.userService.userEnergyNeeds(user);
        return {
            status: 'success',
            message: 'Lấy nhu cầu năng lượng thành công!',
            data: response
        };
    }

    @Post(':id/avatar')
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({
        status: 200,
        type: UserResponse
    })
    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
            destination: './assets/images',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                callback(null, `avatar-${uniqueSuffix}${ext}`);
            }
        }),
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Only image files are allowed!'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB
        }
    }))
    async uploadAvatarController(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<BaseResponse<UserResponse>> {
        if (!file) {
            throw new Error('No file uploaded');
        }
        const avatarPath = `/images/${file.filename}`;
        
        // Get current user to preserve existing profile data
        const currentUser = await this.userService.findUserById(id);
        
        // Extract only the fields we want to keep, excluding any malformed avatar
        const { avatar: oldAvatar, ...profileWithoutAvatar } = currentUser.profile || {};
        
        const updatedProfile = {
            ...profileWithoutAvatar,
            avatar: avatarPath
        };
        
        const response = await this.userService.updateUser(id, {
            profile: updatedProfile
        } as any);
        return {
            status: 'success',
            message: 'Cập nhật avatar thành công!',
            data: response
        };
    }
}
