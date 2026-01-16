import { create } from 'zustand';
import { authApi } from '@/api/auth';
import { type LoginPayload, type RegisterPayload, type User } from '@/types/auth';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/getApiErrorMessage';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isInitializing: boolean;

    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: localStorage.getItem('access_token'),
    isAuthenticated: !!localStorage.getItem('access_token'),
    isLoading: false,
    error: null,
    isInitializing: true,

    login: async (payload: LoginPayload) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authApi.login(payload);
            const token = response.access_token;

            localStorage.setItem('access_token', token);
            set({ token, isAuthenticated: true });

            // Fetch user details immediately after login
            const user = await authApi.me();
            set({ user, isLoading: false, error: null });
        } catch (error: any) {
            const errorMessage = getApiErrorMessage(error);
            set({
                isLoading: false,
                error: errorMessage
            });
            toast.error(errorMessage);
            throw error;
        }
    },

    register: async (payload: RegisterPayload) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authApi.register(payload);
            const token = response.access_token;

            localStorage.setItem('access_token', token);
            set({ token, isAuthenticated: true });

            // Fetch user details after registration
            const user = await authApi.me();
            set({ user, isLoading: false, error: null });

            // Show success message and redirect to dashboard
            toast.success("Account created successfully!");
        } catch (error: any) {
            const errorMessage = getApiErrorMessage(error);
            set({
                isLoading: false,
                error: errorMessage
            });
            toast.error(errorMessage);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, token: null, isAuthenticated: false });
        window.location.href = '/login';
    },

    checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            set({ isAuthenticated: false, user: null, isInitializing: false });
            return;
        }

        try {
            const user = await authApi.me();
            set({ user, isAuthenticated: true, isInitializing: false });
        } catch (error) {
            // If /me fails (e.g. token expired), logout
            localStorage.removeItem('access_token');
            set({ user: null, token: null, isAuthenticated: false, isInitializing: false });
        }
    },

    initAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            set({ isInitializing: false, isAuthenticated: false, user: null });
            return;
        }

        try {
            const user = await authApi.me();
            set({ 
                user, 
                isAuthenticated: true, 
                isInitializing: false,
                token 
            });
        } catch (error) {
            // Token invalid/expired
            localStorage.removeItem('access_token');
            set({ 
                user: null, 
                token: null, 
                isAuthenticated: false, 
                isInitializing: false 
            });
        }
    }
}));