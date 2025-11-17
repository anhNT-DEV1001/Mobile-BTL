import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class ExerciseSetDto {
    @ApiProperty({ description: 'Số lần lặp', example: 10 })
    @IsNotEmpty({ message: 'Vui lòng nhập số lần lặp!' })
    @IsNumber({}, { message: 'Số lần lặp phải là số!' })
    @Min(1, { message: 'Số lần lặp phải lớn hơn 0!' })
    reps: number;

    @ApiProperty({ description: 'Trọng lượng tạ (kg)', example: 70, required: false })
    @IsOptional()
    @IsNumber({}, { message: 'Trọng lượng phải là số!' })
    @Min(0, { message: 'Trọng lượng không được âm!' })
    weight?: number;
}

export class CreateUserExerciseDto {
    @ApiProperty({ description: 'ID của bài tập', example: '507f1f77bcf86cd799439011' })
    @IsNotEmpty({ message: 'Vui lòng chọn bài tập!' })
    @IsString({ message: 'ID bài tập không hợp lệ!' })
    exercise: string;

    @ApiProperty({ description: 'ID của buổi tập', example: '507f1f77bcf86cd799439012' })
    @IsNotEmpty({ message: 'Vui lòng chọn buổi tập!' })
    @IsString({ message: 'ID buổi tập không hợp lệ!' })
    workout: string;

    @ApiProperty({ 
        description: 'Danh sách các set', 
        type: [ExerciseSetDto],
        example: [{ reps: 10, weight: 70 }, { reps: 8, weight: 75 }]
    })
    @IsArray({ message: 'Sets phải là một mảng!' })
    @ArrayMinSize(1, { message: 'Phải có ít nhất 1 set!' })
    @ValidateNested({ each: true })
    @Type(() => ExerciseSetDto)
    sets: ExerciseSetDto[];

    @ApiProperty({ description: 'Ghi chú', required: false })
    @IsOptional()
    @IsString()
    note?: string;
}

export class UpdateUserExerciseDto {
    @ApiProperty({ description: 'ID của bài tập', required: false })
    @IsOptional()
    @IsString({ message: 'ID bài tập không hợp lệ!' })
    exercise?: string;

    @ApiProperty({ description: 'Danh sách các set', type: [ExerciseSetDto], required: false })
    @IsOptional()
    @IsArray({ message: 'Sets phải là một mảng!' })
    @ArrayMinSize(1, { message: 'Phải có ít nhất 1 set!' })
    @ValidateNested({ each: true })
    @Type(() => ExerciseSetDto)
    sets?: ExerciseSetDto[];

    @ApiProperty({ description: 'Ghi chú', required: false })
    @IsOptional()
    @IsString()
    note?: string;
}
