export interface User {
    id: number;
    email: string;
    full_name: string;
    is_active: boolean;
    is_superuser: boolean;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface LoginPayload {
    phone: string; // Backend expects phone number for login
    password: string;
}

export interface RegisterPayload {
    name: string;
    phone: string;
    email: string;
    password: string;
}