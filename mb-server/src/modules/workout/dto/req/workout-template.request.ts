import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateWorkoutTemplateDto {
    @ApiProperty({ description: 'Tên template', example: 'Full Body Workout' })
    @IsNotEmpty({ message: 'Vui lòng nhập tên template!' })
    @MaxLength(100, { message: 'Tên không được quá 100 ký tự!' })
    name: string;

    @ApiProperty({ 
        description: 'Danh sách ID các bài tập', 
        example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'] 
    })
    @IsArray({ message: 'Exercises phải là một mảng!' })
    @IsNotEmpty({ message: 'Vui lòng chọn ít nhất 1 bài tập!' })
    exercises: string[];

    @ApiProperty({ description: 'Mức độ', example: 'intermediate', required: false })
    @IsOptional()
    @IsString()
    level?: string;

    @ApiProperty({ description: 'Loại template', example: 'strength', required: false })
    @IsOptional()
    @IsString()
    type?: string;

    @ApiProperty({ description: 'Ghi chú', required: false })
    @IsOptional()
    @IsString()
    note?: string;
}

export class UpdateWorkoutTemplateDto {
    @ApiProperty({ description: 'Tên template', required: false })
    @IsOptional()
    @MaxLength(100, { message: 'Tên không được quá 100 ký tự!' })
    name?: string;

    @ApiProperty({ description: 'Danh sách ID các bài tập', required: false })
    @IsOptional()
    @IsArray({ message: 'Exercises phải là một mảng!' })
    exercises?: string[];

    @ApiProperty({ description: 'Mức độ', required: false })
    @IsOptional()
    @IsString()
    level?: string;

    @ApiProperty({ description: 'Loại template', required: false })
    @IsOptional()
    @IsString()
    type?: string;

    @ApiProperty({ description: 'Ghi chú', required: false })
    @IsOptional()
    @IsString()
    note?: string;
}
