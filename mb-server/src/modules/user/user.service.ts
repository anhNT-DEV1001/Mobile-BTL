import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Connection, Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/req/user.request';
import { UserStatus } from 'src/common/enums';
import * as bcrypt from 'bcrypt';
import { UserResponse } from './dto/res/user.response';
import { ApiError } from 'src/common/api';
import { Token, TokenDocument } from '../auth/schema/token.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectConnection() private conn: Connection,
    ) { }

    toUserResponse(user: UserDocument): UserResponse {
        return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            status: user.status,
            profile: user.profile ? {
                avatar: user.profile.avatar,
                name: user.profile.name,
                gender: user.profile.gender,
                dob: user.profile.dob,
                height: user.profile.height,
                weight: user.profile.weight
            } : null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    async createUser(userData: CreateUserDto): Promise<UserResponse> {
        const existUser = await this.userModel.findOne({ email: userData.email });
        if (existUser) throw new ApiError('Thông tin người dùng tồn tại !', HttpStatus.BAD_REQUEST);
        const hashPass = await bcrypt.hash(userData.password, 10);
        const data = {
            ...userData,
            password: hashPass,
            isActive: userData.profile ? true : false,
            status: userData.profile ? UserStatus.ACTIVE : UserStatus.INACTIVE
        }

        const newUser = await this.userModel.create(data);
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

    // version thêm transaction
    async deleteUser(id: string): Promise<UserResponse | any> {
        const session = await this.conn.startSession();
        session.startTransaction();
        try {
            await this.tokenModel.findOneAndDelete({ createdBy: id });
            const user = await this.userModel.findByIdAndDelete({ id });
            if (!user) throw new ApiError('Xóa người dùng thất bại !', HttpStatus.BAD_REQUEST);
            await session.commitTransaction();
            return this.toUserResponse(user);
        } catch (error) {
            await session.abortTransaction()
        }
        session.endSession();
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
