import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WorkOut, WorkOutDocument } from './schema/workout.schema';
import { Model } from 'mongoose';
import { UserResponse } from '../user/dto/res/user.response';
import { caculateStrengthLevel } from 'src/common/utils';
import { ApiError } from 'src/common/api';
import { WorkOutLevel } from 'src/common/enums';

@Injectable()
export class WorkoutService {
    constructor(@InjectModel(WorkOut.name) private workoutModel: Model<WorkOutDocument>) { }

    async getWorkOutLevelByWorkoutId(user: UserResponse, workoutId: string): Promise<WorkOutLevel> {
        const workOut = await this.workoutModel.findById(workoutId);
        if (!workOut) throw new ApiError('Bài tập này không tồn tại !', HttpStatus.BAD_GATEWAY);
        if (!user.profile) throw new ApiError('Người dùng chưa có thông tin cá nhân !', HttpStatus.BAD_REQUEST);
        const level = caculateStrengthLevel(user.profile?.weight, user.profile?.height, workOut?.weight, user.profile?.gender)
        return level;
    }
}
