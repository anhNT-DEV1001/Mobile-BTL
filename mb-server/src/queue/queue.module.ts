import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationProcessor } from './processor/notification.processor';
// import { NotificationProcessor } from './notification.processor';


@Module({
  imports:[
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory : async (config : ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
        }
      })
    }),
    BullModule.registerQueue({
      name : 'notification'
    })
  ],
  providers: [NotificationProcessor],
  exports: [BullModule],
})
export class QueueModule {}
