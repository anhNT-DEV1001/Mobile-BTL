import { WorkOutLevel, WorkoutStatus } from "src/common/enums";
import { Metadata } from "src/common/metadata";

export class WorkoutResponse extends Metadata {
    name: string;
    exersie: string;
    weight: number;
    reps: number;
    sets: number;
    break: number;
    rest: number;
    userLevel: WorkOutLevel;
    note?: string | null;
    status: WorkoutStatus;
}