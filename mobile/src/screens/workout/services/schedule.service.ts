import { api } from "@/src/common/apis/axios";

export interface Schedule {
  id: string;
  name: string;
  type?: string;
  replay?: number;
  templates: any;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateOrUpdateScheduleDto {
  name: string;
  type?: string;
  replay?: number;
  templates: string[]; // workout template IDs
}

export const getUserSchedule = async (): Promise<Schedule | null> => {
  try {
    const response = await api.get("/schedule");
    return response.data as Schedule;
  } catch (error: any) {
    // Nếu user chưa có schedule, BE có thể trả 400 -> coi như chưa có
    if (error.statusCode === 400) return null;
    throw error;
  }
};

export const createSchedule = async (
  data: CreateOrUpdateScheduleDto
): Promise<Schedule> => {
  const response = await api.post("/schedule", data);
  return response.data as Schedule;
};

export const updateSchedule = async (
  data: CreateOrUpdateScheduleDto
): Promise<Schedule> => {
  const response = await api.patch("/schedule", data);
  return response.data as Schedule;
};

export const deleteSchedule = async (): Promise<void> => {
  await api.delete("/schedule");
};
