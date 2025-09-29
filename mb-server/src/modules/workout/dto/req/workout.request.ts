import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from "class-validator";
import { WorkoutStatus } from "src/common/enums";

export class CreateWorkoutDto {
    @ApiProperty()
    @IsOptional()
    @MaxLength(50, { message: 'Tên không được quá 50 ký tự !' })
    name?: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'Vui lòng chọn bài tập !' })
    exersie: string;
    @ApiProperty()
    @IsNumber({}, { message: 'Vui lòng nhập mức tạ!' })
    weight: number;
    @ApiProperty()
    @IsNumber({}, { message: 'Vui lòng nhập số reps!' })
    reps: number;
    @ApiProperty()
    @IsNumber({}, { message: 'Vui lòng nhập số sets!' })
    sets: number;
    @ApiProperty()
    @IsNumber({}, { message: 'Vui lòng nhập số lượt nghỉ mỗi set!' })
    break: number;
    @ApiProperty()
    @IsOptional()
    note?: string | null;
    @ApiProperty()
    status: WorkoutStatus;
}