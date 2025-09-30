import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { CurrentUser } from 'src/common/decorators/user-current.decorator';
import { BaseResponse } from 'src/common/api';
import { WorkoutResponse } from './dto/res/workout.response';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateWorkoutDto, UpdateWorkoutDto } from './dto/req/workout.request';
import { BearerType } from 'src/common/enums';

@ApiTags('Workouts')
@ApiBearerAuth(BearerType.AccessToken)
@Controller('workout')
export class WorkoutController {
    constructor(private workoutService: WorkoutService) { }

    @Get('')
    @ApiResponse({
        status: 200,
        type: [WorkoutResponse]
    })
    async getWorkoutByUserController(@CurrentUser() user): Promise<BaseResponse<WorkoutResponse[]>> {
        const res = await this.workoutService.getWorkoutByUser(user);
        return {
            status: 'success',
            message: 'Lấy danh sách bài tập thành công !',
            data: res
        }
    }

    @Post()
    @ApiResponse({
        status: 201,
        type: WorkoutResponse
    })
    async createWorkoutController(
        @CurrentUser() user,
        @Body() workoutDto: CreateWorkoutDto
    ): Promise<BaseResponse<WorkoutResponse>> {
        const res = await this.workoutService.createWorkout(workoutDto, user);
        return {
            status: 'success',
            message: 'Tạo mới bài tập thành công !',
            data: res
        }
    }

    @Patch(':id')
    @ApiResponse({
        status: 200,
        type: WorkoutResponse
    })
    async updateWorkoutController(
        @Param('id') id: string,
        @Body() workoutDto: UpdateWorkoutDto
    ): Promise<BaseResponse<WorkoutResponse>> {
        const res = await this.workoutService.updateWorkout(id, workoutDto);
        return {
            status: 'success',
            message: 'Cập nhật bài tập thành công !',
            data: res
        };
    }
    @Delete(':id')
    @ApiResponse({
        status: 200,
        type: WorkoutResponse
    })
    async deleteWorkoutController(@Param('id') id: string): Promise<BaseResponse<WorkoutResponse>> {
        const res = await this.workoutService.deleteWorkout(id);
        return {
            status: 'success',
            message: 'Xóa bài tập thành công !',
            data: res
        }
    }
}

