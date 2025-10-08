import { useAuthStore } from "./useAuthStore"

export const useIsLoggedIn = () => {
    return useAuthStore((state) => Boolean(state.tokens?.accessToken));
}

export const useCurrentUser = () => {
    return useAuthStore((state) => state.user);
}