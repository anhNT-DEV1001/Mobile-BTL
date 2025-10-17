import { api } from "@/src/common/apis";
import { BaseResponse } from "@/src/common/types";
import { User } from "@/src/common/types/auth.type";

// Lấy danh sách workouts của user
export const getUserWorkouts = async (): Promise<BaseResponse<any[]>> => {
    const res = await api.get('/workout');
    return res.data;
};

// Cập nhật thông tin profile user
export const updateUserProfile = async (userId: string, data: any): Promise<BaseResponse<User>> => {
    const res = await api.patch(`/user/${userId}`, data);
    return res.data;
};