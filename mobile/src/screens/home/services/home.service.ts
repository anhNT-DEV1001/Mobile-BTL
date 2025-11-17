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

/**
 * Get user workout level
 * @returns string
 */
export const getUserWorkoutLevel = async() => {
    const res = await api.get('/workout/level');
    return res.data;
}

/**
 * Get user BMI level
 * @returns object with bmi number and message string
 */
export const getUserBmiLevel = async(): Promise<BaseResponse<{ bmi: number; message: string }>> => {
    const res = await api.get('/user/bmi');
    return res.data;
}
