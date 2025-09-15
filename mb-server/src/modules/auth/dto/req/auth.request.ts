import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Vui lòng nhập email !' })
    @IsEmail({}, { message: 'Vui lòng nhập đúng định dạng email !' })
    @MaxLength(50, { message: 'Email có tối đa 50 ký tự !' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu!' })
    @MinLength(6, { message: "Mật khẩu cần ít nhất 6 ký tự !" })
    @MaxLength(20, { message: 'Mật khẩu có tối đa 20 ký tự !' })
    password: string;
}

export class PayLoadDto {
    @ApiProperty()
    sub: string;
    @ApiProperty()
    email: string;
}

export class RefreshDto {
    @ApiProperty()
    @IsNotEmpty()
    userId: string;
    @ApiProperty()
    @IsNotEmpty()
    refreshToken: string;
}