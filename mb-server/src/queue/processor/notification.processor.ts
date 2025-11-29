import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq'; 

@Processor('notification')
export class NotificationProcessor extends WorkerHost {
  async process(job: Job<any, any, string>) {
    console.log('Processing job:', job.id);
    console.log('Job data:', job.data);
    // giả lập xử lý notification
    console.log(`Send notification: ${job.data.title} - ${job.data.message}`);
  }
}