import { InjectModel } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exercise } from './../../schema/exercises.schema';
export class ExerciseResponse {
    @ApiProperty()
    _id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    force: string;
    @ApiProperty()
    level: string;
    @ApiProperty()
    mechanic: string;
    @ApiProperty()
    equipment: string;
    @ApiProperty({ type: [String] })
    primaryMuscles: string[];
    @ApiProperty({ type: [String] })
    secondaryMuscles: string[]
    @ApiProperty({ type: [String] })
    instructions: string[]
    @ApiProperty()
    category: string;
    @ApiProperty({ type: [String] })
    images: string[]
    @ApiProperty()
    id: string;
}