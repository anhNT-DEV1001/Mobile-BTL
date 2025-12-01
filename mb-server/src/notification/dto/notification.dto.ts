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
  @ApiProperty()
  @IsOptional()
  days: number[];
  @ApiProperty({ description: "Giờ gửi dạng 'HH:mm', ví dụ '08:30' hoặc '18:15'", type: String })
  @IsOptional()
  time: string; // chỉ nhận string HH:mm
}

export class ScheduleNotificationDto {
  @ApiProperty({ description: 'Schedule Id' })
  @IsOptional()
  scheduleId: string;

  @ApiProperty({ description: 'Ngày trong tuần (ví dụ: [1,3,5]). 0=Chủ nhật', type: [Number] })
  @IsOptional()
  days: number[];

  @ApiProperty({ description: "Giờ gửi dạng 'HH:mm', ví dụ '08:30' hoặc '18:15'", type: String })
  @IsOptional()
  time: string; // chỉ nhận string HH:mm
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