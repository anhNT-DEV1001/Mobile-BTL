import { useAuthStore } from "@/src/common/stores";
import { useMutation } from "@tanstack/react-query";
import { LoginRequest, loginService, logoutService } from "../services/auth.service";
import { router } from "expo-router";

export function useAuth() {
    const setAuth = useAuthStore((state) => state.setAuth); 
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const loginMutation = useMutation({
        mutationFn : loginService,
        onSuccess: (res) => {
            if(res.status === 'success' && res.data) {
                const {user, tokens} = res.data;
                setAuth(user, tokens);
                //navigate to home
                router.replace('/');
            }
        },
        onError: (error : any) => {
            console.log("Login error: ", error);
        }
    });

    const login = (paload : LoginRequest) => {
        loginMutation.mutate(paload);
    }

    const logoutMutation = useMutation({
        mutationFn : logoutService,
        onSuccess: (res) => {
            if(res.status === 'success') {
                clearAuth();
                router.replace('/(auth)/login');
            }
        },
        onError: (error : any) => {
            console.log("Logout error: ", error);
        }
    })

    const logout = () => {
        logoutMutation.mutate();
    }

    return {
        loginMutation,
        logoutMutation,
        login,
        logout
        
    }
}