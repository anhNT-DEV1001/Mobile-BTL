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


  async createUserNoti(user : UserResponse , dto : NotificationDto) {
    const data = {
      expoToken : dto.expoToken,
      delay : dto.delay,
      schedule : dto.schedule,
      createdBy: user.id,
      updatedBy: user.id
    } as NotificationDocument
    const userNotification = await this.notiModel.create(data);
    if(!userNotification) throw new ApiError('Faild to create user notification !' , HttpStatus.BAD_REQUEST);
    return userNotification;
  }

  async getUserNoti(user: UserResponse) {
    const userNoti = await this.notiModel.findOne({createdBy : user.id});
    if(!userNoti) throw new ApiError('Faild to get user notification !', HttpStatus.BAD_REQUEST);
    return userNoti;
  }

  async updateUserNoti (user : UserResponse , dto : NotificationDto) {
    const data = {
      expoToken : dto.expoToken,
      delay : dto.delay,
      schedule : dto.schedule,
      createdBy: user.id,
      updatedBy: user.id
    } as NotificationDocument
    const updated = await this.notiModel.findOneAndUpdate({createdBy : user.id}, data);
    if(!updated) throw new ApiError('Faild to updated user notification !' , HttpStatus.BAD_REQUEST);
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
   * Đặt lịch gửi notification lặp lại theo interval hoặc cron
   */
  async handleScheduleRepeatNotification(user: UserResponse, dto: ScheduleNotificationDto): Promise<string> {
    // Lấy token từ Notification schema theo user.id
    const userNoti = await this.notiModel.findOne({ createdBy: user.id });
    if (!userNoti) throw new ApiError('User chưa có notification token', HttpStatus.BAD_REQUEST);
    // Lấy schedule
    const schedule = await this.scheduleModel.findById(dto.scheduleId);
    if (!schedule) throw new ApiError('Schedule không tồn tại!', HttpStatus.BAD_REQUEST);
    const message = dto.message || `Bạn có lịch tập: ${schedule.name} vào hôm nay`;
    // Job key: ensure uniqueness theo user+schedule
    const jobId = `noti_repeat_${user.id}_${schedule._id}`;
    const data = {
      token: userNoti.expoToken,
      title: 'Lịch tập',
      body: message,
      scheduleId: schedule._id,
      userId: user.id
    };
    if (dto.intervalMs) {
      await this.scheduleRepeatable(jobId, data, dto.intervalMs);
    } else if (dto.cronPattern) {
      await this.scheduleCron(jobId, data, dto.cronPattern);
    } else {
      throw new ApiError('Bạn phải nhập intervalMs hoặc cronPattern!', HttpStatus.BAD_REQUEST);
    }
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
}
