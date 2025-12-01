import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Notifcation, NotificationDocument } from './schema/notification.schema';
import { Model } from 'mongoose';
import { UserResponse } from 'src/modules/user/dto/res/user.response';
import { ApiError } from 'src/common/api';
import { NotificationDto } from './dto';
import { ScheduleNotificationDto, RemoveScheduleNotificationDto } from './dto/notification.dto';
import { Schedule, ScheduleDocument } from '../modules/schedule/schema/schedule.schema';
import { Model as ScheduleModel } from 'mongoose';
import { InjectModel as InjectScheduleModel } from '@nestjs/mongoose';
import { Job, Queue as BullQueue } from 'bullmq';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notification') private notiQueue: Queue,
    @InjectModel(Notifcation.name) private notiModel : Model<NotificationDocument>,
    @InjectScheduleModel(Schedule.name) private scheduleModel: ScheduleModel<ScheduleDocument>
  ) {}

  async sendNotification(data: any) {
    await this.notiQueue.add('send-noti', data, {
      delay: 0,     
      attempts: 3,
    });
  }

  async notiSchedule(data : any , cronExpression: string, jobId: string) {
    await this.notiQueue.add('send-noti', data, {
        repeat: {
          pattern: cronExpression, 
        },
        jobId: jobId, 
        removeOnComplete: true,
      });
      console.log(`Đã lên lịch job ${jobId} với pattern: ${cronExpression}`);
    }
  

  /**
   * Hàm gửi thông báo Push
   * @param token Expo Push Token của user
   * @param title Tiêu đề
   * @param body Nội dung
   * @param delayInSeconds (Tùy chọn) Số giây muốn trì hoãn. Mặc định = 0 (gửi ngay)
   */
  async sendPushNotification(
    token: string, 
    title: string, 
    body: string, 
    delayInSeconds: number = 0
  ) {
    const delay = delayInSeconds * 1000;

    await this.notiQueue.add(
      'send-push', 
      {
        token,
        title,
        body,
        dataPayload: { sentAt: new Date() }
      },
      {
        delay: delay, 
        removeOnComplete: true,
        attempts: 3, 
        backoff: 5000,
      }
    );

    console.log(`[Producer] Đã thêm job push cho token ${token.slice(0, 10)}... Delay: ${delayInSeconds}s`);
  }


  async createUserNoti(user: UserResponse, dto: NotificationDto) {
    // Validate days/time nếu có
    let days: number[] | undefined = undefined;
    let time: string | undefined = undefined;
    if (dto.days) {
      if (!Array.isArray(dto.days) || !dto.days.every(n => typeof n === 'number')) {
        throw new ApiError('days phải là mảng số', HttpStatus.BAD_REQUEST);
      }
      days = dto.days;
    }
    if (dto.time) {
      if (typeof dto.time !== 'string' || !/^\d{2}:\d{2}$/.test(dto.time)) {
        throw new ApiError("time phải là chuỗi 'HH:mm'", HttpStatus.BAD_REQUEST);
      }
      time = dto.time;
    }
    const data = {
      expoToken: dto.expoToken,
      delay: dto.delay,
      schedule: dto.schedule,
      createdBy: user.id,
      updatedBy: user.id,
      ...(days ? { days } : {}),
      ...(time ? { time } : {}),
    } as any;
    const userNotification = await this.notiModel.create(data);
    if (!userNotification) throw new ApiError('Faild to create user notification !', HttpStatus.BAD_REQUEST);
    return userNotification;
  }

  async getUserNoti(user: UserResponse) {
    const userNoti = await this.notiModel.findOne({createdBy : user.id});
    if(!userNoti) throw new ApiError('Faild to get user notification !', HttpStatus.BAD_REQUEST);
    return userNoti;
  }

  async updateUserNoti(user: UserResponse, dto: NotificationDto) {
    // Validate days/time nếu có
    let days: number[] | undefined = undefined;
    let time: string | undefined = undefined;
    if (dto.days) {
      if (!Array.isArray(dto.days) || !dto.days.every(n => typeof n === 'number')) {
        throw new ApiError('days phải là mảng số', HttpStatus.BAD_REQUEST);
      }
      days = dto.days;
    }
    if (dto.time) {
      if (typeof dto.time !== 'string' || !/^\d{2}:\d{2}$/.test(dto.time)) {
        throw new ApiError("time phải là chuỗi 'HH:mm'", HttpStatus.BAD_REQUEST);
      }
      time = dto.time;
    }
    const data = {
      expoToken: dto.expoToken,
      delay: dto.delay,
      schedule: dto.schedule,
      createdBy: user.id,
      updatedBy: user.id,
      ...(days ? { days } : {}),
      ...(time ? { time } : {}),
    } as any;
    const updated = await this.notiModel.findOneAndUpdate({ createdBy: user.id }, data, { new: true });
    if (!updated) throw new ApiError('Faild to updated user notification !', HttpStatus.BAD_REQUEST);
    return updated;
  }

  async delUserNoti(user: UserResponse){
    const del = await this.notiModel.findOneAndDelete({createdBy : user.id});
    if(!del) throw new ApiError('Faild to delete user notification !', HttpStatus.BAD_REQUEST);
    return del;
  }
  
  async scheduleRepeatable(
    jobId: string, 
    data: any, 
    everyMs: number
  ) {
    await this.notiQueue.add(
      'send-push', 
      data,
      {
        jobId: jobId, 
        repeat: {
          every: everyMs, 
        },
        removeOnComplete: true, 
      }
    );
    console.log(`[Producer] Đã lên lịch lặp lại mỗi ${everyMs}ms. JobID: ${jobId}`);
  }

  async scheduleCron(
    jobId: string,
    data: any,
    cronExpression: string
  ) {
    await this.notiQueue.add(
      'send-push',
      data,
      {
        jobId: jobId,
        repeat: {
          pattern: cronExpression, 
        }
      }
    );
    console.log(`[Producer] Đã lên lịch Cron: ${cronExpression}. JobID: ${jobId}`);
  }

  async removeScheduledJob(jobId: string, repeatConfig: { every?: number; pattern?: string }) {
    const jobKey = await this.notiQueue.removeRepeatable(
      'send-push', 
      repeatConfig, 
      jobId
    );

    if (jobKey) {
      console.log(`[Producer] Đã xóa thành công JobID: ${jobId}`);
      return true;
    } else {
      console.log(`[Producer] Không tìm thấy JobID: ${jobId} để xóa.`);
      return false;
    }
  }

  /**
   * Đặt lịch gửi notification lặp lại dựa trên days (arr int) và time (chuỗi HH:mm)
   */
  async handleScheduleRepeatNotification(user: UserResponse, dto: ScheduleNotificationDto): Promise<string> {
    // Lấy notification theo user.id
    const userNoti = await this.notiModel.findOne({ createdBy: user.id });
    if (!userNoti) throw new ApiError('User chưa có notification token', HttpStatus.BAD_REQUEST);

    // Lấy schedule từ id (vẫn giữ để sinh message chuẩn)
    const schedule = await this.scheduleModel.findById(dto.scheduleId);
    if (!schedule) throw new ApiError('Schedule không tồn tại!', HttpStatus.BAD_REQUEST);

    // Lấy cấu hình days, time từ bản ghi notification
    const days = userNoti.days;
    const time = userNoti.time;
    if (!days || !Array.isArray(days) || days.length === 0) {
      throw new ApiError('Notification chưa cấu hình days (mảng thứ trong tuần, 0-6)', HttpStatus.BAD_REQUEST);
    }
    if (!time || typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) {
      throw new ApiError("Notification chưa cấu hình hoặc sai format time 'HH:mm'", HttpStatus.BAD_REQUEST);
    }
    // Tách giờ phút
    const [hour, minute] = time.split(':').map(Number);
    if (
      Number.isNaN(hour) || Number.isNaN(minute) ||
      hour < 0 || hour > 23 || minute < 0 || minute > 59
    ) {
      throw new ApiError("Time trong notification phải dạng hợp lệ (HH:mm)", HttpStatus.BAD_REQUEST);
    }
    const message = `Bạn có lịch tập: ${schedule.name} vào hôm nay!`;
    // Job key: ensure uniqueness
    const jobId = `noti_repeat_${user.id}_${schedule._id}`;
    const data = {
      token: userNoti.expoToken,
      title: 'Lịch tập',
      body: message,
      scheduleId: schedule._id,
      userId: user.id
    };
    const cronPattern = `${minute} ${hour} * * ${days.join(",")}`;
    await this.scheduleCron(jobId, data, cronPattern);
    return jobId;
  }

  /**
   * Xóa tất cả repeatable jobs theo jobId
   */
  async removeScheduleRepeatJob(dto: RemoveScheduleNotificationDto): Promise<boolean> {
    // Lấy repeatable jobs theo jobId
    const queue = this.notiQueue as BullQueue; // chắc chắn đúng type
    const allRepeatables = await queue.getRepeatableJobs();
    const matchedJobs = allRepeatables.filter(job => job.id === dto.jobId);
    let removed = 0;
    for (const job of matchedJobs) {
      const repeatJobKey = job.key;
      await queue.removeRepeatableByKey(repeatJobKey);
      removed++;
      console.log(`[Producer] Đã xóa repeatable jobId = ${dto.jobId}, key=${repeatJobKey}`);
    }
    if (removed === 0) {
      console.log(`[Producer] Không tìm thấy repeatable jobId = ${dto.jobId}`);
    }
    return removed > 0;
  }

  /**
   * Xóa toàn bộ repeatable jobs trong queue notification
   */
  async removeAllRepeatJobs(): Promise<number> {
    const queue = this.notiQueue as BullQueue;
    const allRepeatables = await queue.getRepeatableJobs();
    let removed = 0;
    for(const job of allRepeatables) {
      await queue.removeRepeatableByKey(job.key);
      removed++;
      console.log(`[Producer] Đã xoá repeatable job key = ${job.key}`);
    }
    return removed;
  }

  /**
   * Generate cron pattern from days array and time (Date instance)
   * days: số thứ trong tuần: [1,2,4] - 0=Chủ nhật, 1=Thứ 2, ...
   * time: Date instance chỉ quan tâm giờ và phút
   * VD: days=[1,3,5], time=2023-01-01T08:30:00 -> '30 8 * * 1,3,5'
   */
  private generateCronPatternFromDaysTime(days: number[], time: Date): string {
    if (!days || !time) throw new Error('Missing days or time');
    const minutes = time.getMinutes();
    const hours = time.getHours();
    const daysStr = days.join(",");
    // Cron: minute hour * * dayOfWeek(s)
    return `${minutes} ${hours} * * ${daysStr}`;
  }
}
