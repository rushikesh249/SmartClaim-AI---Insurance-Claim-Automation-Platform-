export interface User {
    id: string; // UUID as string
    name: string;
    phone: string;
    email?: string;
    language_preference: string;
    created_at: string; // ISO date string
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