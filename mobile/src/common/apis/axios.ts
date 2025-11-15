import axios, { AxiosError, AxiosRequestConfig } from "axios";
import type { ApiErrorResponse } from "../types";
import { useAuthStore } from "../stores/useAuthStore";
import { API_URL } from "@/src/config";
import { router } from "expo-router";

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

    const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token!);
    });
    failedQueue = [];
    };

    export const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    });

    // 🧠 Thêm token vào request trước khi gửi
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

// ⚙️ Xử lý khi accessToken hết hạn (401)
    api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        const authStore = useAuthStore.getState();

        // Nếu bị 401 và chưa retry
            if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Nếu đang refresh -> xếp request này vào hàng đợi
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                    if (originalRequest.headers)
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(api(originalRequest));
                    },
                    reject,
                });
                });
            }

        isRefreshing = true;
        const refreshToken = authStore.tokens?.refreshToken;

        if (!refreshToken) {
            authStore.clearAuth();
            router.replace("/(auth)/login");
            return Promise.reject(error);
        }

        try {
            // 🪄 Gọi API refresh token
            const res = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
            });

            const newAccessToken = res.data.accessToken;
            // Cập nhật token mới
            authStore.updateAccessToken(newAccessToken);

            // Xử lý lại hàng đợi các request cũ
            processQueue(null, newAccessToken);
            isRefreshing = false;

            // Gán token mới cho request hiện tại và gửi lại
            if (originalRequest.headers)
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (err) {
            processQueue(err, null);
            isRefreshing = false;
            authStore.clearAuth();
            router.replace("/(auth)/login");
            return Promise.reject(err);
        }
        }

        // 🧩 Lỗi không có phản hồi từ server
        if (error.request && !error.response) {
        return Promise.reject({
            statusCode: 0,
            message: "Không thể kết nối tới máy chủ",
            field: null,
        });
        }

        // 🧩 Các lỗi khác
        return Promise.reject({
        statusCode: error.response?.status ?? -1,
        message: error.response?.data?.message || error.message,
        field: error.response?.data?.field ?? null,
        });
    }
    );
