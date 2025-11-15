import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateWorkoutDto {
    @ApiProperty({ description: 'Tên buổi tập', example: 'Morning Workout', required: false })
    @IsOptional()
    @MaxLength(100, { message: 'Tên không được quá 100 ký tự!' })
    name?: string;

    @ApiProperty({ description: 'Ngày tập', example: '2025-01-15' })
    @IsNotEmpty({ message: 'Vui lòng chọn ngày tập!' })
    @IsDateString({}, { message: 'Ngày tập không hợp lệ!' })
    date: Date;

    @ApiProperty({ description: 'Ghi chú', required: false })
    @IsOptional()
    note?: string;
}

export class UpdateWorkoutDto {
    @ApiProperty({ description: 'Tên buổi tập', required: false })
    @IsOptional()
    @MaxLength(100, { message: 'Tên không được quá 100 ký tự!' })
    name?: string;

    @ApiProperty({ description: 'Ngày tập', required: false })
    @IsOptional()
    @IsDateString({}, { message: 'Ngày tập không hợp lệ!' })
    date?: Date;

    @ApiProperty({ description: 'Ghi chú', required: false })
    @IsOptional()
    note?: string;
}