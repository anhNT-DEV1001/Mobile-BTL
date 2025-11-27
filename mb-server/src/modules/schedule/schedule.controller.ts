import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CurrentUser } from 'src/common/decorators/user-current.decorator';
import { UserResponse } from '../user/dto/res/user.response';
import { ScheduleDto } from './dto';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BearerType } from 'src/common/enums';

@ApiTags('Schedule')
@ApiBearerAuth(BearerType.AccessToken)
@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService : ScheduleService) {}
  @Post()
  @ApiResponse({
    status : 201,
    // type
  })
  async createScheduleController(
    @CurrentUser() user : UserResponse,
    @Body() dto : ScheduleDto
  ) {
    const res = await this.scheduleService.createSchedule(user, dto)
    return res
  }

  @Get()
  @ApiResponse({
    status : 200,
    // type
  })
  async getUserSchedule(@CurrentUser() user : UserResponse) {
    const res = await this.scheduleService.getUserSchedule(user);
    return res;
  }

  @Patch()
  @ApiResponse({
    status : 200,
    // type
  })
  async updateUserSchedule(
    @CurrentUser() user : UserResponse,
    @Body() dto : ScheduleDto
  ) {
    const res = await this.scheduleService.updateUserSchedule(user , dto);
    return res;
  }

  @Delete()
  @ApiResponse({
    status : 200,
    // type
  })
  async deleteUserSchedule(
    @CurrentUser() user : UserResponse
  ) {
    const res = await this.scheduleService.deleteUserSchedule(user);
    return res;
  }
}
