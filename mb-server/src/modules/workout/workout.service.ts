import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WorkOut, WorkOutDocument } from './schema/workout.schema';
import { Model } from 'mongoose';
import { UserResponse } from '../user/dto/res/user.response';
import { caculateStrengthLevel } from 'src/common/utils';
import { ApiError } from 'src/common/api';
import { WorkOutLevel } from 'src/common/enums';
import { Exercise, ExerciseDocument } from '../exercises/schema/exercises.schema';

@Injectable()
export class WorkoutService {
    constructor(
        @InjectModel(WorkOut.name) private workoutModel: Model<WorkOutDocument>,
        @InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>
    ) { }

    async getWorkOutLevelByWorkoutId(user: UserResponse, workoutId: string): Promise<WorkOutLevel> {
        const workOut = await this.workoutModel.findById(workoutId);
        if (!workOut) throw new ApiError('Bài tập này không tồn tại !', HttpStatus.BAD_GATEWAY);
        if (!user.profile) throw new ApiError('Người dùng chưa có thông tin cá nhân !', HttpStatus.BAD_REQUEST);
        const level = caculateStrengthLevel(user.profile?.weight, user.profile?.height, workOut?.weight, user.profile?.gender)
        return level;
    }

    async createWorkout(workoutDto: any): Promise<any> {
        // lưu thông thông tin workout
        const isExercise = await this.exerciseModel.findById(workoutDto.id);

        if (!isExercise) throw new ApiError("Bài tập này không tồn tại !", HttpStatus.BAD_REQUEST);
        if (!workoutDto.name) workoutDto.name = isExercise.name;


        const newWorkout = await this.workoutModel.create(workoutDto);
        if (!newWorkout) throw new ApiError("Tạo bài tập thất bại !", HttpStatus.BAD_REQUEST);
        return newWorkout;
    }
}
