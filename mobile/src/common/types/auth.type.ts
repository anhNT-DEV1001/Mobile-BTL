export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface User {
    id: string;
    email: string;
    role: string;
    status: string;
    profile?: any | null;
}

export interface AuthState {
    user: User | null;
    tokens: Tokens | null;

    setAuth: (user: User, tokens: Tokens) => void;
    clearAuth: () => void;
    updateAccessToken: (token: string) => void;
}

export interface LoginResponse {
    user: User;
    tokens: Tokens;
}