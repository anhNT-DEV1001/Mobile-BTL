import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from '../notification.service';

@Injectable()
export class NotificationCron {
  constructor(private readonly notificationService: NotificationService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    console.log('Adding notification job...');
    await this.notificationService.sendNotification({
      title: 'Hello',
      message: 'This is a test notification',
    });
  }
}