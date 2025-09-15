import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ApiError } from 'src/common/api';
import * as bcrypt from 'bcrypt';
import { LoginDto, PayLoadDto } from './dto/req/auth.request';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponse, TokensResponse } from './dto/res/auth.response';
import { UserResponse } from '../user/dto/res/user.response';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './schema/token.schema';
import { CreateUserDto } from '../user/dto/req/user.request';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>
    ) { }

    async login(loginData: LoginDto): Promise<LoginResponse> {
        const user = await this.userService.findUserByEmail(loginData.email);
        if (!user) throw new ApiError('Thông tin người dùng không tồn tại !', HttpStatus.BAD_REQUEST);
        const isValidPass = await bcrypt.compare(loginData.password, user.password);
        if (!isValidPass) throw new ApiError('Mật khẩu không đúng, vui lòng nhập lại !', HttpStatus.BAD_REQUEST);
        const userRes: UserResponse = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
        const tokens = await this.genarateTokens(userRes.id, userRes.email);

        const hashRt = await bcrypt.hash(tokens.refreshToken, 10);
        const existToken = await this.tokenModel.findOne({ createdBy: user._id });
        if (existToken) {
            existToken.hashRt = hashRt;
            existToken.expriseAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 ngày
                await existToken.save();
        } else {
            await this.tokenModel.create({
                hashRt,
                expriseAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 ngày
                createdBy: user._id
            })
        }
        return {
            user: userRes,
            tokens
        };
    }

    async genarateTokens(userId: string, email: string): Promise<TokensResponse> {
        const payload: PayLoadDto = {
            sub: userId, email: email
        }
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('jwt.accessSecret'),
            expiresIn: this.configService.get<string>('jwt.accessExpriseIn')
        })
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('jwt.refreshSecret'),
            expiresIn: this.configService.get<string>('jwt.refreshExpriseIn')
        })

        return { accessToken, refreshToken };
    }

    async refreshToken(userId: string, refreshToken: string): Promise<TokensResponse> {

        const tokenDoc = await this.tokenModel.findOne({ createdBy: userId });
        if (!tokenDoc) {
            throw new ApiError('Refresh token không tồn tại, vui lòng đăng nhập !', HttpStatus.BAD_REQUEST);
        }
        if (tokenDoc.expriseAt <= new Date()) {
            throw new ApiError('Refresh token hết hạn, vui lòng đăng nhập lại !', HttpStatus.BAD_REQUEST);
        }

        const payload = await this.jwtService.verifyAsync(refreshToken, {
            secret: this.configService.get<string>('jwt.refreshSecret'),
        });
        if (!payload) throw new ApiError('Refresh token hết hạn, vui lòng đăng nhập lại !', HttpStatus.BAD_REQUEST);

        const isMatch = await bcrypt.compare(refreshToken, tokenDoc.hashRt);
        if (!isMatch) {
            throw new ApiError('Refresh Token không khớp với DB !', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userService.findUserById(userId);
        if (!user) {
            throw new ApiError('Người dùng không tồn tại', HttpStatus.BAD_REQUEST);
        }

        const newTokens = await this.genarateTokens(userId, user.email);
        return newTokens;
    }

    async logout(userId: string): Promise<UserResponse> {
        const user = await this.userService.findUserById(userId);
        if (!user) throw new ApiError('Đăng xuất thất bại !', HttpStatus.BAD_REQUEST);
        await this.tokenModel.findOneAndDelete({ createdBy: userId })
        return this.userService.toUserResponse(user);
    }

    async register(userData: CreateUserDto): Promise<UserResponse> {
        const user = await this.userService.createUser(userData);
        if (!user) throw new ApiError('Đăng ký người dùng thất bại !', HttpStatus.BAD_REQUEST);
        return user;
    }
}
