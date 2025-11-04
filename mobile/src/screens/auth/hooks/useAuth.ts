import { useAuthStore } from "@/src/common/stores";
import { useMutation } from "@tanstack/react-query";
import { LoginRequest, loginService, logoutService, RegisterRequest, registerService } from "../services/auth.service";
import { router } from "expo-router";
import { Alert } from "react-native";

export function useAuth() {
    const setAuth = useAuthStore((state) => state.setAuth); 
    const clearAuth = useAuthStore((state) => state.clearAuth);
    
    const loginMutation = useMutation({
        mutationFn : loginService,
        onSuccess: (res) => {
            if(res.status === 'success' && res.data) {
                const {user, tokens} = res.data;
                setAuth(user, tokens);
                
                // Log đăng nhập thành công
                console.log("✅ Đăng nhập thành công!");
                console.log("User:", user.email);
                console.log("User ID:", user.id);
                console.log("Role:", user.role);
                
                // Navigate to home
                router.replace('/');
            }
        },
        onError: (error : any) => {
            console.error("❌ Đăng nhập thất bại!");
            console.error("Error:", error);
            
            Alert.alert(
                "Đăng nhập thất bại",
                error?.message || "Vui lòng kiểm tra lại email và mật khẩu!",
                [{ text: "OK" }]
            );
        }
    });

    const registerMutation = useMutation({
        mutationFn: registerService,
        onSuccess: (res) => {
            if(res.status === 'success') {
                // Log đăng ký thành công
                console.log("✅ Đăng ký tài khoản thành công!");
                console.log("User created:", res.data?.email);
                console.log("User ID:", res.data?.id);
                
                // Hiển thị thông báo thành công
                Alert.alert(
                    "Đăng ký thành công! 🎉",
                    "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.",
                    [
                        { 
                            text: "Đăng nhập ngay",
                            onPress: () => router.push('/(auth)/login')
                        }
                    ]
                );
            }
        },
        onError: (error: any) => {
            console.error("❌ Đăng ký thất bại!");
            console.error("Error:", error);
            
            Alert.alert(
                "Đăng ký thất bại",
                error?.message || "Có lỗi xảy ra. Vui lòng thử lại!",
                [{ text: "OK" }]
            );
        }
    });

    const login = (payload : LoginRequest) => {
        loginMutation.mutate(payload);
    }

    const register = (payload: RegisterRequest) => {
        registerMutation.mutate(payload);
    }

    const logoutMutation = useMutation({
        mutationFn : logoutService,
        onSuccess: (res) => {
            if(res.status === 'success') {
                console.log("✅ Đăng xuất thành công!");
                clearAuth();
                router.replace('/(auth)/login');
            }
        },
        onError: (error : any) => {
            router.replace('/(auth)/login');
            clearAuth();
            console.error("❌ Đăng xuất thất bại!");
            console.error("Error:", error);
            
            Alert.alert(
                "Đăng xuất thất bại",
                error?.message || "Có lỗi xảy ra. Vui lòng thử lại!",
                [{ text: "OK" }]
            );
        }
    })

    const logout = () => {
        logoutMutation.mutate();
    }

    return {
        loginMutation,
        registerMutation,
        logoutMutation,
        login,
        register,
        logout
    }
}