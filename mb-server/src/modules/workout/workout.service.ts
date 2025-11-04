import { name } from './../../../../mobile/node_modules/expo/node_modules/ci-info/index.d';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WorkOut, WorkOutDocument } from './schema/workout.schema';
import { Model } from 'mongoose';
import { UserResponse } from '../user/dto/res/user.response';
import { caculateStrengthLevel } from 'src/common/utils';
import { ApiError } from 'src/common/api';
import { WorkOutLevel, WorkoutStatus } from 'src/common/enums';
import { Exercise, ExerciseDocument } from '../exercises/schema/exercises.schema';
import { CreateWorkoutDto, UpdateWorkoutDto } from './dto/req/workout.request';
import { WorkoutResponse } from './dto/res/workout.response';
import { User, UserDocument } from '../user/schema/user.schema';

@Injectable()
export class WorkoutService {
    constructor(
        @InjectModel(WorkOut.name) private workoutModel: Model<WorkOutDocument>,
        @InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument> 
    ) { }

    toWorkoutResponse(workout: WorkOutDocument): WorkoutResponse {
        return {
            id: workout._id.toString(),
            name: workout.name as string,
            exersie: workout.exersie as string,
            weight: workout.weight,
            reps: workout.reps,
            sets: workout.sets,
            break: workout.break,
            rest: workout.rest,
            userLevel: workout.userLevel as WorkOutLevel,
            note: workout.note,
            status: workout.status,
            createdAt: workout.createdAt,
            createdBy: workout.createdBy,
            updatedAt: workout.updatedAt,
            updatedBy: workout.updatedBy
        }
    }

    async getWorkOutLevelByWorkoutId(user: UserResponse, workoutId: string): Promise<WorkOutLevel> {
        const workOut = await this.workoutModel.findById(workoutId);
        if (!workOut) throw new ApiError('Bài tập này không tồn tại !', HttpStatus.BAD_REQUEST);
        if (!user.profile) throw new ApiError('Người dùng chưa có thông tin cá nhân !', HttpStatus.BAD_REQUEST);
        const level = caculateStrengthLevel(user.profile?.weight, user.profile?.height, workOut?.weight, user.profile?.gender)
        return level;
    }

    async createWorkout(workoutDto: CreateWorkoutDto, user: UserResponse): Promise<WorkoutResponse> {
        // lưu thông thông tin workout
        const isExercise = await this.exerciseModel.findById(workoutDto.exersie);
        if (!isExercise) throw new ApiError("Bài tập này không tồn tại !", HttpStatus.BAD_REQUEST);
        if (!workoutDto.name) workoutDto.name = isExercise.name;
        let level: WorkOutLevel = WorkOutLevel.BEGINNER;
        if (user.profile)
            level = caculateStrengthLevel(user.profile?.weight, user.profile?.height, workoutDto.weight, user.profile?.gender);
        const data: WorkOut = {
            ...workoutDto,
            userLevel: level,
            createdBy: user.id,
            updatedBy: user.id,
            status: WorkoutStatus.INPROGRESS
        }
        const newWorkout = await this.workoutModel.create(data);
        if (!newWorkout) throw new ApiError("Tạo bài tập thất bại !", HttpStatus.BAD_REQUEST);
        return this.toWorkoutResponse(newWorkout);
    }

    async getWorkoutByUser(user: UserResponse): Promise<WorkoutResponse[]> {
        const workouts = await this.workoutModel.find({ createdBy: user.id });
        if (!workouts) throw new ApiError("Người dùng chưa có bài tập !", HttpStatus.BAD_REQUEST);
        return workouts.map(workout => this.toWorkoutResponse(workout));
    }

    async getWorkoutByUserTemplate() {

    }

    async updateWorkout(workoutId: string, workoutDto: UpdateWorkoutDto): Promise<WorkoutResponse> {
        const workout = await this.workoutModel.findByIdAndUpdate(workoutId, workoutDto, { new: true });
        if (!workout) throw new ApiError('Thông tin bài tập không hợp lệ !', HttpStatus.BAD_REQUEST);
        return this.toWorkoutResponse(workout);
    }

    async deleteWorkout(workoutId: string): Promise<WorkoutResponse> {
        const workout = await this.workoutModel.findByIdAndDelete(workoutId);
        if (!workout) throw new ApiError("Bài tập này không tồn tại !", HttpStatus.BAD_REQUEST);
        return this.toWorkoutResponse(workout);
    }

    async getWoroutLevel(user: UserResponse): Promise<WorkOutLevel | null> {
        const userListWorkout = await this.workoutModel.find({ createdBy: user.id });
        if (!userListWorkout || userListWorkout.length === 0) {
            return null;
        }
        const levelCounts = userListWorkout.reduce((counts, workout) => {
            const level = workout.userLevel as WorkOutLevel;
            if (level && Object.values(WorkOutLevel).includes(level)) {
                counts[level] = (counts[level] || 0) + 1;
            }
            return counts;
        }, {} as Record<WorkOutLevel, number>); 
        const countedLevels = Object.keys(levelCounts) as WorkOutLevel[];
        if (countedLevels.length === 0) {
            return null;
        }
        const dominantLevel = countedLevels.reduce((levelA, levelB) => {
            return levelCounts[levelA] > levelCounts[levelB] ? levelA : levelB;
        });
        return dominantLevel;
    }
}
