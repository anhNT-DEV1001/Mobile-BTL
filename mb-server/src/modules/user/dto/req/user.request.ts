import { UserRole, UserStatus } from "src/common/enums";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
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

    @ApiProperty()
    @IsOptional()
    @IsEnum(UserRole, { message: 'Quyền không hợp lệ !' })
    role?: UserRole;

    @ApiProperty()
    @IsOptional()
    @IsBoolean({ message: 'Trạng thái không hợp lệ !' })
    isActive?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsEnum(UserStatus, { message: 'Trạng thái không hợp lệ !' })
    status?: UserStatus;

    @ApiProperty()
    @IsOptional()
    @MaxLength(50, { message: 'Email có tối đa 50 ký tự !' })
    name: string

    @ApiProperty()
    @IsOptional()
    dob: Date
}

export class UpdateUserDto {
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

    @ApiProperty()
    @IsOptional()
    @IsEnum(UserRole, { message: 'Quyền không hợp lệ !' })
    role?: UserRole;

    @ApiProperty()
    @IsOptional()
    @IsBoolean({ message: 'Trạng thái không hợp lệ !' })
    isActive?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsEnum(UserStatus, { message: 'Trạng thái không hợp lệ !' })
    status?: UserStatus;

    @ApiProperty()
    @IsOptional()
    @MaxLength(50, { message: 'Email có tối đa 50 ký tự !' })
    name: string

    @ApiProperty()
    @IsOptional()
    dob: Date
}



