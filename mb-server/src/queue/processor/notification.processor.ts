import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Expo } from 'expo-server-sdk'; 

@Processor('notification')
export class NotificationProcessor extends WorkerHost {
  private expo = new Expo();
  async process(job: Job<any, any, string>) {
    console.log(`[Worker] Đang xử lý Job ID: ${job.id} | Name: ${job.name}`);
    if (job.name === 'send-push') {
      await this.handlePushNotification(job.data);
    }
  }
  private async handlePushNotification(data: any) {
    const { token, title, body, dataPayload } = data;

    //Kiểm tra Token có hợp lệ không
    if (!Expo.isExpoPushToken(token)) {
      console.error(`[Lỗi] Token không hợp lệ: ${token}`);
      return;
    }

    //Tạo nội dung tin nhắn
    const messages = [
      {
        to: token,
        sound: 'default' as const,
        title: title,
        body: body,
        data: dataPayload || {},
      },
    ];

    //Gửi sang Expo
    try {
      const ticketChunks = await this.expo.sendPushNotificationsAsync(messages);
      console.log('[Thành công] Kết quả từ Expo:', ticketChunks);
    } catch (error) {
      console.error('[Lỗi] Gửi thông báo thất bại:', error);
      throw error; // Ném lỗi để BullMQ biết mà thử lại (retry)
    }
  }
}