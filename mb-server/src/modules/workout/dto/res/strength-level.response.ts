import { ApiProperty } from "@nestjs/swagger";

export class StrengthLevelResponse {
    @ApiProperty({ description: 'Mức độ sức mạnh', example: 'novice' })
    level: string;

    @ApiProperty({ description: '1RM ước tính (kg)', example: 86.9 })
    estimatedOneRM: number;

    @ApiProperty({ description: '1RM đã điều chỉnh theo tuổi (kg)', example: 88.4 })
    adjustedOneRM: number;

    @ApiProperty({ description: 'Tỷ lệ so với cân nặng cơ thể', example: 1.04 })
    strengthRatio: number;

    @ApiProperty({ description: 'Phần trăm so với người cùng độ tuổi', example: 39 })
    percentileByAge?: number;

    @ApiProperty({ description: 'Phần trăm so với người cùng hạng cân', example: 30 })
    percentileByWeight?: number;

    @ApiProperty({ description: 'Chi tiết tính toán' })
    details: {
        weight: number;
        reps: number;
        bodyWeight: number;
        age: number;
        gender: string;
    };
}
