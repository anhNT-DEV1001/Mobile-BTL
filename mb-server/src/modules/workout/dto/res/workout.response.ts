import { ApiProperty } from "@nestjs/swagger";
import { WorkOutLevel, WorkoutStatus } from "src/common/enums";
import { Metadata } from "src/common/metadata";

export class WorkoutResponse extends Metadata {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    exersie: string;
    @ApiProperty()
    weight: number;
    @ApiProperty()
    reps: number;
    @ApiProperty()
    sets: number;
    @ApiProperty()
    break: number;
    @ApiProperty()
    rest: number;
    @ApiProperty()
    userLevel: WorkOutLevel;
    @ApiProperty()
    note?: string | null;
    @ApiProperty()
    status: WorkoutStatus;
}