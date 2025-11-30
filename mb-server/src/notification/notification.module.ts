import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { QueueModule } from 'src/queue/queue.module';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notifcation, NotificationSchema } from './schema/notification.schema';
import { Schedule, ScheduleSchema } from 'src/modules/schedule/schema/schedule.schema';

@Module({
  imports:[
    QueueModule,
    MongooseModule.forFeature([
      {name: Notifcation.name , schema: NotificationSchema},
      {name: Schedule.name , schema: ScheduleSchema}
    ])
  ],
  providers: [NotificationService],
  exports:[NotificationService],
  controllers: [NotificationController]
})
export class NotificationModule {}
