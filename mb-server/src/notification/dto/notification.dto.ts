import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
export class TestNotiDto {
  @ApiProperty()
  @IsOptional()
  token: string;
  @ApiProperty()
  @IsOptional()
  delay: number;
}

export class NotificationDto {
  @ApiProperty()
  @IsOptional()
  expoToken : string;
  @ApiProperty()
  @IsOptional()
  delay: number;
  @ApiProperty()
  @IsOptional()
  schedule: string;
}

export class ScheduleNotificationDto {
  @ApiProperty({ description: 'Schedule Id' })
  @IsOptional()
  scheduleId: string;

  @ApiProperty({ description: 'Số mili giây giữa các lần gửi (ví dụ: 10000 cho 10s, 86400000 cho 1 ngày)', required: false })
  @IsOptional()
  intervalMs?: number;

  @ApiProperty({ description: 'Dạng cron (nếu dùng crontab, ví dụ "0 8 * * *" gửi 8h sáng hằng ngày)', required: false })
  @IsOptional()
  cronPattern?: string;

  @ApiProperty({ description: 'Nội dung tuỳ chọn, nếu không có sẽ auto message', required: false })
  @IsOptional()
  message?: string;
}

export class RemoveScheduleNotificationDto {
  @ApiProperty({ description: 'Job Id của notification lặp lại' })
  @IsOptional()
  jobId: string;
  @ApiProperty({ description: 'Interval milliseconds (nếu là kiểu repeat "every")', required: false })
  @IsOptional()
  intervalMs?: number;
  @ApiProperty({ description: 'Cron pattern (nếu là kiểu repeat cron)', required: false })
  @IsOptional()
  cronPattern?: string;
}