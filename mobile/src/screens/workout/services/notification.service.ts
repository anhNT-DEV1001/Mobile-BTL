import { api } from "@/src/common/apis/axios";

export interface UserNotificationConfig {
  id: string;
  expoToken: string;
  delay: number;
  schedule: string;
  days: number[];
  time: string; // 'HH:mm'
}

export interface UpsertNotificationDto {
  expoToken?: string;
  delay?: number;
  schedule?: string;
  days?: number[];
  time?: string; // 'HH:mm'
}

export const getUserNotification = async (): Promise<UserNotificationConfig | null> => {
  try {
    const res = await api.get("/notification");
    return res.data.data as UserNotificationConfig;
  } catch (error: any) {
    if (error.statusCode === 400) return null;
    throw error;
  }
};

export const createUserNotification = async (
  body: UpsertNotificationDto
): Promise<UserNotificationConfig> => {
  const res = await api.post("/notification", body);
  return res.data.data as UserNotificationConfig;
};

export const updateUserNotification = async (
  body: UpsertNotificationDto
): Promise<UserNotificationConfig> => {
  const res = await api.patch("/notification", body);
  return res.data.data as UserNotificationConfig;
};

export const createRepeatNotificationJob = async (scheduleId: string) => {
  const res = await api.post("/notification/repeat", { scheduleId });
  return res.data; // { success, jobId, message }
};

export const deleteAllRepeatNotificationJobs = async () => {
  const res = await api.delete("/notification/repeat/all");
  return res.data; // { success, deleted, message }
};



