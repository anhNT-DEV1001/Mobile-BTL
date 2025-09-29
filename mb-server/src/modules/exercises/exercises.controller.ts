import { BaseResponse } from './../../common/api/response.api';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ExerciseResponse } from './dto/res/exercise.response';
import { CreateExerciseDto, ExerciseQuery, UpdateExerciseDto } from './dto/req/exercise.request';
import { BearerType } from 'src/common/enums';


@Controller('exercises')
@ApiBearerAuth(BearerType.AccessToken)
export class ExercisesController {
    constructor(private exerciseService: ExercisesService) { }
    @Get()
    @ApiResponse({
        status: 200,
        description: 'Trả về danh sách bài tập phân trang',
    })
    async findAllExerciseController(@Query() query: ExerciseQuery): Promise<BaseResponse<{ items: ExerciseResponse[]; total: number; page: number; limit: number }>> {
        const res = await this.exerciseService.findAll(query);
        return {
            status: 'success',
            message: 'Lấy danh sách bài tập thành công !',
            data: res
        }
    }
    @Post()
    @ApiResponse({
        status: 201,
        type: ExerciseResponse
    })
    async createExerciseController(@Body() exerciseData: CreateExerciseDto): Promise<BaseResponse<ExerciseResponse>> {
        const response = await this.exerciseService.createExercise(exerciseData);
        return {
            status: 'success',
            message: 'Tạo bài tập thành công !',
            data: response
        };
    }

    @Patch(':id')
    @ApiResponse({
        status: 200,
        type: ExerciseResponse
    })
    @ApiParam({ name: 'id', description: 'Exercise ID' })
    async updateExerciseController(
        @Param('id') id: string,
        @Body() exerciseData: UpdateExerciseDto
    ): Promise<BaseResponse<ExerciseResponse>> {
        const response = await this.exerciseService.updateExercise(id, exerciseData);
        return {
            status: 'success',
            message: 'Cập nhật bài tập thành công !',
            data: response
        };
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        type: ExerciseResponse
    })
    @ApiParam({ name: 'id', description: 'Exercise ID' })
    async deleteExerciseController(@Param('id') id: string): Promise<BaseResponse<ExerciseResponse>> {
        const response = await this.exerciseService.deleteExercise(id);
        return {
            status: 'success',
            message: 'Xóa bài tập thành công !',
            data: response
        };
    }
}
