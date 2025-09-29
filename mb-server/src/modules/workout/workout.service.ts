import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WorkOut, WorkOutDocument } from './schema/workout.schema';
import { Model } from 'mongoose';
import { UserResponse } from '../user/dto/res/user.response';
import { caculateStrengthLevel } from 'src/common/utils';
import { ApiError } from 'src/common/api';
import { WorkOutLevel } from 'src/common/enums';
import { Exercise, ExerciseDocument } from '../exercises/schema/exercises.schema';
import { CreateWorkoutDto } from './dto/req/workout.request';

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

    async createWorkout(workoutDto: CreateWorkoutDto, user: UserResponse): Promise<any> {
        // lưu thông thông tin workout
        const isExercise = await this.exerciseModel.findById(workoutDto.exersie);
        if (!isExercise) throw new ApiError("Bài tập này không tồn tại !", HttpStatus.BAD_REQUEST);
        if (!workoutDto.name) workoutDto.name = isExercise.name;
        let level: WorkOutLevel = WorkOutLevel.BEGINNER;
        if (user.profile)
            level = caculateStrengthLevel(user.profile?.weight, user.profile?.height, workoutDto.weight, user.profile?.gender);
        const data = {
            ...workoutDto,
            userLevel: level
        }
        const newWorkout = await this.workoutModel.create(workoutDto);
        if (!newWorkout) throw new ApiError("Tạo bài tập thất bại !", HttpStatus.BAD_REQUEST);
        return newWorkout;
    }
}
