export type ApiStatus = "success" | "error";

export interface BaseResponse<T> {
    status: ApiStatus;
    message: string;
    data: T | null;
}

export interface ApiFieldError {
    [key: string]: string;
}

export interface ApiErrorResponse {
    statusCode: number;
    message: string;
    field?: ApiFieldError | null;
}
