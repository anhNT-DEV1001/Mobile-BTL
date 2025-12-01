import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto, TestNotiDto, ScheduleNotificationDto, RemoveScheduleNotificationDto } from './dto';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { BearerType } from 'src/common/enums';
import { CurrentUser } from 'src/common/decorators/user-current.decorator';
import { BaseResponse } from 'src/common/api';

@ApiTags('Notification')
@ApiBearerAuth(BearerType.AccessToken)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notiService: NotificationService) {}

  @ApiResponse({
      status : 200,
      // type
    })
  @Post('test-push')
  async testPush(@Body() body: TestNotiDto) {
    // Body nhận vào: { "token": "ExponentPushToken[...]", "delay": 5 }
    
    const { token, delay } = body;

    await this.notiService.sendPushNotification(
      token,
      "Xin chào từ NestJS!",
      delay > 0 
        ? `Thông báo này đã được hẹn giờ ${delay} giây.` 
        : "Thông báo tức thì.",
      delay
    );

    return { 
      success: true, 
      message: delay > 0 ? "Đã lên lịch gửi!" : "Đang gửi..." 
    };
  }

  @Post()
  @ApiResponse({
    status : 200,
  })
  async createUserNotififcationController(@CurrentUser() user , @Body() dto : NotificationDto) : Promise<BaseResponse<any>> {
    const res = await this.notiService.createUserNoti(user , dto);
    return {
      status : 'success',
      message: 'create susccess !',
      data : res
    }
  }

  @Get()
  @ApiResponse({
    status: 200
  })
  async getUserNotiController(@CurrentUser() user) : Promise<BaseResponse<any>> {
    const res = await this.notiService.getUserNoti(user);
    return {
      status: 'success',
      message: 'Created success !',
      data: res
    }
  } 

  @Patch()
  @ApiResponse({
    status : 200
  })
  async updateUserNotiController(@CurrentUser() user , @Body() dto : NotificationDto) : Promise<BaseResponse<any>> {
    const res = await this.notiService.updateUserNoti(user, dto);
    return {
      status :'success',
      message: 'updated suceess !',
      data: res
    }
  }

  @Delete()
  @ApiResponse({
    status : 200
  })
  async delUserNotification(@CurrentUser() user) : Promise<BaseResponse<any>> {
    const res = await this.notiService.delUserNoti(user);
    return {
      status :'success',
      message: 'updated suceess !',
      data: res
    }
  }
  
  @Delete('remove')
  async removeJob(@Body() body: any) {
    // Để xóa, cần biết jobId VÀ cấu hình lặp (seconds hoặc cron)
    // body: { "jobId": "job_user_1", "seconds": 10 } 
    // HOẶC body: { "jobId": "job_daily_1", "cron": "*/10 * * * * *" }

    let config;
    if (body.seconds) {
      config = { every: body.seconds * 1000 };
    } else if (body.cron) {
      config = { pattern: body.cron };
    }

    const result = await this.notiService.removeScheduledJob(body.jobId, config);
    
    return { 
      success: result, 
      message: result ? "Đã xóa lịch thành công" : "Không tìm thấy lịch để xóa" 
    };
  }

  /**
   * Tạo lịch lặp gửi notification cho lịch tập: chỉ cần truyền scheduleId (string), days (mảng số thứ trong tuần), time (chuỗi HH:mm).
   * ví dụ body: { scheduleId: 'id lịch', days: [1,3,5], time: '08:30' }
   * Hệ thống sẽ tự sinh cron gửi đúng các ngày/giờ này.
   */
  @Post('repeat')
  @ApiResponse({ status: 200, description: 'Schedule repeat notification successfully' })
  @ApiBody({ type: ScheduleNotificationDto })
  async scheduleRepeatNotification(
    @CurrentUser() user,
    @Body() dto: ScheduleNotificationDto
  ) {
    console.log('[NotificationController] /notification/repeat called', {
      userId: user?.id,
      scheduleId: dto.scheduleId,
    });
    // Service đã đảm trách kiểm tra đủ trường và tạo lịch phù hợp.
    const jobId = await this.notiService.handleScheduleRepeatNotification(user, dto);
    return {
      success: true,
      jobId,
      message: 'Đã lên lịch gửi thông báo lặp lại!'
    };
  }

  @Delete('repeat')
  @ApiResponse({ status: 200, description: 'Remove repeat notification job' })
  @ApiBody({ type: RemoveScheduleNotificationDto })
  async removeRepeatNotification(
    @Body() dto: RemoveScheduleNotificationDto
  ) {
    console.log('[NotificationController] /notification/repeat DELETE called', {
      jobId: dto.jobId,
    });
    const result = await this.notiService.removeScheduleRepeatJob(dto);
    return {
      success: result,
      message: result ? 'Đã xóa lịch notification định kỳ thành công!' : 'Không tìm thấy job hoặc không xóa được!'
    };
  }

  @Delete('repeat/all')
  async removeAllRepeatNotifications() {
    const result = await this.notiService.removeAllRepeatJobs();
    return {
      success: true,
      deleted: result,
      message: `Đã xoá ${result} repeatable notifications trong queue!`
    };
  }
}