import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
        retry: false,              // không tự retry khi có lỗi
            refetchOnWindowFocus: false,
        },
    },
});
