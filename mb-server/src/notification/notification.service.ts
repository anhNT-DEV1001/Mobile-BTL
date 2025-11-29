import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationService {
  constructor(@InjectQueue('notification') private notiQueue: Queue ) {}

  async sendNotification(data: any) {
    await this.notiQueue.add('send-noti', data, {
      delay: 0,     
      attempts: 3,
    });
  }
}
