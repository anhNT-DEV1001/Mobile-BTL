import { ApiProperty } from "@nestjs/swagger";
import { Metadata } from "src/common/metadata";

export class WorkoutResponse extends Metadata {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    name: string;
    
    @ApiProperty()
    date: Date;
    
    @ApiProperty()
    note?: string;
}

export class ExerciseSetResponse {
    @ApiProperty()
    reps: number;
    
    @ApiProperty()
    weight?: number;
    
    @ApiProperty()
    level?: string | null;
}

export class UserExerciseResponse extends Metadata {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    exercise: any; // Có thể populate thành Exercise object
    
    @ApiProperty()
    workout: string;
    
    @ApiProperty({ type: [ExerciseSetResponse] })
    sets: ExerciseSetResponse[];
    
    @ApiProperty()
    totalVolume?: number;
    
    @ApiProperty()
    note?: string;
}

export class WorkoutTemplateResponse extends Metadata {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    name: string;
    
    @ApiProperty()
    exercises: any[]; // Có thể populate thành Exercise objects
    
    @ApiProperty()
    level?: string | null;
    
    @ApiProperty()
    type?: string | null;
    
    @ApiProperty()
    note?: string | null;
}