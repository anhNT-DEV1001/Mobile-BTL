import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import { AuthState } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create<AuthState>() (
    persist(
        (set) => ({
            user : null,
            tokens: null,
            setAuth: (user, tokens) => set({ user, tokens }),
            clearAuth: () => set({ user: null, tokens: null }),
            updateAccessToken: (accessToken) =>
                set((state) => ({
                tokens: state.tokens
                    ? { ...state.tokens, accessToken }
                    : { accessToken, refreshToken: "" },
            })),
        }),
        {
            name : "auth-storage",
            storage : {
                getItem: async (name: string) => {
                    const value = await AsyncStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: async (name: string, value: any) => {
                    await AsyncStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: async (name: string) => {
                    await AsyncStorage.removeItem(name);
                },
            },
        }
    )
);