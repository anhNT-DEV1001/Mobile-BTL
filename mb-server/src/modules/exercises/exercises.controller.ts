import { BaseResponse } from './../../common/api/response.api';
import { Controller, Get, Query } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ExerciseResponse } from './dto/res/exercise.response';
import { ExerciseQuery } from './dto/req/exercise.request';
import { BearerType } from 'src/common/enums';


@Controller('exercises')
@ApiBearerAuth(BearerType.AccessToken)
export class ExercisesController {
    constructor(private exerciseService: ExercisesService) { }
    // @Public()
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
}
