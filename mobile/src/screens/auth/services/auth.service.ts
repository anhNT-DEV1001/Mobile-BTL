import { api } from "@/src/common/apis"
import { BaseResponse, LoginResponse, User } from "@/src/common/types";

export interface LoginRequest {
    email : string;
    password : string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    profile?: {
        name: string;
        gender: "male" | "female";
        dob: string;
        height: number;
        weight: number;
    };
}

export const loginService = async (payload : LoginRequest) : Promise<BaseResponse<LoginResponse>> => {
    const res = await api.post('/auth/login' , payload);
    return res.data;
}

export const registerService = async (payload: RegisterRequest): Promise<BaseResponse<User>> => {
    const res = await api.post('/auth/register', payload);
    return res.data;
}

export const logoutService = async () => {
    const res = await api.post('/auth/logout');
    return res.data;
}
