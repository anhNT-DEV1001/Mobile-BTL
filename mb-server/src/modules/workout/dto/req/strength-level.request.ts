import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class CalculateStrengthLevelDto {
    @ApiProperty({ description: 'Trọng lượng tạ (kg)', example: 70 })
    @IsNotEmpty({ message: 'Vui lòng nhập trọng lượng!' })
    @IsNumber({}, { message: 'Trọng lượng phải là số!' })
    @Min(0, { message: 'Trọng lượng không được âm!' })
    weight: number;

    @ApiProperty({ description: 'Số lần lặp', example: 8 })
    @IsNotEmpty({ message: 'Vui lòng nhập số lần lặp!' })
    @IsNumber({}, { message: 'Số lần lặp phải là số!' })
    @Min(1, { message: 'Số lần lặp phải lớn hơn 0!' })
    reps: number;
}
