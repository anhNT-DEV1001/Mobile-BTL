import { WorkoutStatus } from "src/common/enums";

export class WorkoutResponse {
    name: string;
    exersie: string;
    weight: number;
    reps: number;
    sets: number;
    break: number;
    note: string | null;
    status: WorkoutStatus;
}