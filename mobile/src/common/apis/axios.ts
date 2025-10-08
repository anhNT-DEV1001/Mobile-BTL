import axios, { AxiosError } from "axios";
import type { ApiErrorResponse } from "../types";
import { useAuthStore } from "../stores";

export const api = axios.create({
    baseURL: String(process.env.EXPO_PUBLIC_API_URL),
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
    const token = useAuthStore.getState().tokens?.accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
        const { message, statusCode, field } = error.response.data;
        return Promise.reject({ statusCode, message, field });
    }
    if (error.request) {
    return Promise.reject({
        statusCode: 0,
        message: "Không thể kết nối tới máy chủ",
        field: null,
    });
    }
    return Promise.reject({
        statusCode: -1,
        message: error.message,
        field: null,
    });
    }
);
