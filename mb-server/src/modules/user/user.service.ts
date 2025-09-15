import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/req/user.request';
import { UserStatus } from 'src/common/enums';
import * as bcrypt from 'bcrypt';
import { UserResponse } from './dto/res/user.response';
import { ApiError } from 'src/common/api';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    toUserResponse(user: UserDocument): UserResponse {
        return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            status: user.status,
            name: user.name,
            dob: user.dob,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    async createUser(userData: CreateUserDto): Promise<UserResponse> {
        const existUser = await this.userModel.findOne({ email: userData.email });
        if (existUser) throw new ApiError('Thông tin người dùng tồn tại !', HttpStatus.BAD_REQUEST);

        const hashPass = await bcrypt.hash(userData.password, 10);
        const dto: CreateUserDto = {
            ...userData,
            password: hashPass,
            status: userData.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
        }

        const newUser = (await this.userModel.create(dto));
        const res = this.toUserResponse(newUser);
        return res;
    }

    async findAll(): Promise<UserResponse[]> {
        const users = await this.userModel.find();
        const res = users.map(user => this.toUserResponse(user));
        return res;
    }

    async updateUser(id: string, userData: UpdateUserDto): Promise<UserResponse> {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, userData, { new: true });
        if (!updatedUser) throw new ApiError('Cập nhật thông tin người dùng thất bại !', HttpStatus.BAD_REQUEST);
        const res = this.toUserResponse(updatedUser);
        return res;
    }

    async deleteUser(id: string): Promise<UserResponse> {
        const user = await this.userModel.findByIdAndDelete(id);
        if (!user) throw new ApiError('Xóa người dùng thất bại !', HttpStatus.BAD_REQUEST);
        return this.toUserResponse(user);

    }

    async findUserByEmail(email: string): Promise<UserDocument> {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new ApiError('Thông tin người dùng không tồn tại !', HttpStatus.BAD_REQUEST);
        return user;
    }

    async findUserById(id: string): Promise<UserDocument> {
        const user = await this.userModel.findById(id);
        if (!user) throw new ApiError('Không tìm thấy thông tin người dùng !', HttpStatus.BAD_REQUEST);
        return user;
    }
}
