import { api } from "@/src/common/apis"
import { BaseResponse, LoginResponse } from "@/src/common/types";

export interface LoginRequest {
    email : string;
    password : string;
}
export const loginService = async (payload : LoginRequest) : Promise<BaseResponse<LoginResponse>> => {
    const res = await api.post('/auth/login' , payload);
    return res.data;
}

export const logoutService = async () => {
    const res = await api.post('/auth/logout');
    return res.data;
}