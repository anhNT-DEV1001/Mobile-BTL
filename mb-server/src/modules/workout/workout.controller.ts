import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { CurrentUser } from 'src/common/decorators/user-current.decorator';
import { BaseResponse } from 'src/common/api';
import { UserExerciseResponse, WorkoutResponse, WorkoutTemplateResponse } from './dto/res/workout.response';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateWorkoutDto, UpdateWorkoutDto } from './dto/req/workout.request';
import { BearerType } from 'src/common/enums';
import { CreateUserExerciseDto, UpdateUserExerciseDto } from './dto/req/user-exercise.request';
import { CreateWorkoutTemplateDto, UpdateWorkoutTemplateDto } from './dto/req/workout-template.request';

@ApiTags('Workouts')
@ApiBearerAuth(BearerType.AccessToken)
@Controller('workout')
export class WorkoutController {
    constructor(private workoutService: WorkoutService) { }

    // ==================== WORKOUT ENDPOINTS ====================

    @Get()
    @ApiResponse({ status: 200, type: [WorkoutResponse] })
    async getWorkoutsByUser(@CurrentUser() user): Promise<BaseResponse<WorkoutResponse[]>> {
        const res = await this.workoutService.getWorkoutsByUser(user);
        return {
            status: 'success',
            message: 'Lấy danh sách buổi tập thành công!',
            data: res
        }
    }

    @Get(':id')
    @ApiResponse({ status: 200, type: WorkoutResponse })
    async getWorkoutById(
        @Param('id') id: string,
        @CurrentUser() user
    ): Promise<BaseResponse<WorkoutResponse>> {
        const res = await this.workoutService.getWorkoutById(id, user);
        return {
            status: 'success',
            message: 'Lấy thông tin buổi tập thành công!',
            data: res
        }
    }

    @Post()
    @ApiResponse({ status: 201, type: WorkoutResponse })
    async createWorkout(
        @CurrentUser() user,
        @Body() workoutDto: CreateWorkoutDto
    ): Promise<BaseResponse<WorkoutResponse>> {
        const res = await this.workoutService.createWorkout(workoutDto, user);
        return {
            status: 'success',
            message: 'Tạo buổi tập mới thành công!',
            data: res
        }
    }

    @Patch(':id')
    @ApiResponse({ status: 200, type: WorkoutResponse })
    async updateWorkout(
        @Param('id') id: string,
        @Body() workoutDto: UpdateWorkoutDto,
        @CurrentUser() user
    ): Promise<BaseResponse<WorkoutResponse>> {
        const res = await this.workoutService.updateWorkout(id, workoutDto, user);
        return {
            status: 'success',
            message: 'Cập nhật buổi tập thành công!',
            data: res
        };
    }

    @Delete(':id')
    @ApiResponse({ status: 200, type: WorkoutResponse })
    async deleteWorkout(
        @Param('id') id: string,
        @CurrentUser() user
    ): Promise<BaseResponse<WorkoutResponse>> {
        const res = await this.workoutService.deleteWorkout(id, user);
        return {
            status: 'success',
            message: 'Xóa buổi tập thành công!',
            data: res
        }
    }

    // ==================== USER EXERCISE ENDPOINTS ====================

    @Get(':workoutId/exercises')
    @ApiResponse({ status: 200, type: [UserExerciseResponse] })
    async getUserExercisesByWorkout(
        @Param('workoutId') workoutId: string,
        @CurrentUser() user
    ): Promise<BaseResponse<UserExerciseResponse[]>> {
        const res = await this.workoutService.getUserExercisesByWorkout(workoutId, user);
        return {
            status: 'success',
            message: 'Lấy danh sách bài tập thành công!',
            data: res
        }
    }

    @Post('exercises')
    @ApiResponse({ status: 201, type: UserExerciseResponse })
    async createUserExercise(
        @Body() dto: CreateUserExerciseDto,
        @CurrentUser() user
    ): Promise<BaseResponse<UserExerciseResponse>> {
        const res = await this.workoutService.createUserExercise(dto, user);
        return {
            status: 'success',
            message: 'Thêm bài tập vào buổi tập thành công!',
            data: res
        }
    }

    @Patch('exercises/:id')
    @ApiResponse({ status: 200, type: UserExerciseResponse })
    async updateUserExercise(
        @Param('id') id: string,
        @Body() dto: UpdateUserExerciseDto,
        @CurrentUser() user
    ): Promise<BaseResponse<UserExerciseResponse>> {
        const res = await this.workoutService.updateUserExercise(id, dto, user);
        return {
            status: 'success',
            message: 'Cập nhật bài tập thành công!',
            data: res
        }
    }

    @Delete('exercises/:id')
    @ApiResponse({ status: 200, type: UserExerciseResponse })
    async deleteUserExercise(
        @Param('id') id: string,
        @CurrentUser() user
    ): Promise<BaseResponse<UserExerciseResponse>> {
        const res = await this.workoutService.deleteUserExercise(id, user);
        return {
            status: 'success',
            message: 'Xóa bài tập thành công!',
            data: res
        }
    }

    // ==================== WORKOUT TEMPLATE ENDPOINTS ====================

    @Get('templates/list')
    @ApiResponse({ status: 200, type: [WorkoutTemplateResponse] })
    async getWorkoutTemplates(@CurrentUser() user): Promise<BaseResponse<WorkoutTemplateResponse[]>> {
        const res = await this.workoutService.getWorkoutTemplates(user);
        return {
            status: 'success',
            message: 'Lấy danh sách template thành công!',
            data: res
        }
    }

    @Get('templates/:id')
    @ApiResponse({ status: 200, type: WorkoutTemplateResponse })
    async getWorkoutTemplateById(
        @Param('id') id: string,
        @CurrentUser() user
    ): Promise<BaseResponse<WorkoutTemplateResponse>> {
        const res = await this.workoutService.getWorkoutTemplateById(id, user);
        return {
            status: 'success',
            message: 'Lấy thông tin template thành công!',
            data: res
        }
    }

    @Post('templates')
    @ApiResponse({ status: 201, type: WorkoutTemplateResponse })
    async createWorkoutTemplate(
        @Body() dto: CreateWorkoutTemplateDto,
        @CurrentUser() user
    ): Promise<BaseResponse<WorkoutTemplateResponse>> {
        const res = await this.workoutService.createWorkoutTemplate(dto, user);
        return {
            status: 'success',
            message: 'Tạo template thành công!',
            data: res
        }
    }

    @Patch('templates/:id')
    @ApiResponse({ status: 200, type: WorkoutTemplateResponse })
    async updateWorkoutTemplate(
        @Param('id') id: string,
        @Body() dto: UpdateWorkoutTemplateDto,
        @CurrentUser() user
    ): Promise<BaseResponse<WorkoutTemplateResponse>> {
        const res = await this.workoutService.updateWorkoutTemplate(id, dto, user);
        return {
            status: 'success',
            message: 'Cập nhật template thành công!',
            data: res
        }
    }

    @Delete('templates/:id')
    @ApiResponse({ status: 200, type: WorkoutTemplateResponse })
    async deleteWorkoutTemplate(
        @Param('id') id: string,
        @CurrentUser() user
    ): Promise<BaseResponse<WorkoutTemplateResponse>> {
        const res = await this.workoutService.deleteWorkoutTemplate(id, user);
        return {
            status: 'success',
            message: 'Xóa template thành công!',
            data: res
        }
    }

    @Post('templates/:id/create-workout')
    @ApiResponse({ status: 201 })
    async createWorkoutFromTemplate(
        @Param('id') templateId: string,
        @Body('date') date: Date,
        @CurrentUser() user
    ): Promise<BaseResponse<any>> {
        const res = await this.workoutService.createWorkoutFromTemplate(templateId, date, user);
        return {
            status: 'success',
            message: 'Tạo buổi tập từ template thành công!',
            data: res
        }
    }
}

