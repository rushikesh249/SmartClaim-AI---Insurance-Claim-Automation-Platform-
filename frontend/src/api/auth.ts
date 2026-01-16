import client from './client';
import { type LoginPayload, type RegisterPayload, type AuthResponse, type User } from '@/types/auth';

// Utility to clean phone numbers - remove all non-digits
const cleanPhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    // Clean phone number before sending
    const cleanPayload = {
      ...payload,
      phone: cleanPhone(payload.phone)
    };
    
    // Debug logging
    if (import.meta.env.DEV) {
      console.log('FINAL REGISTER PAYLOAD:', cleanPayload);
    }
    
    const response = await client.post<AuthResponse>('/api/v1/auth/register', cleanPayload);
    return response.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    // Clean phone number before sending
    const cleanPayload = {
      ...payload,
      phone: cleanPhone(payload.phone)
    };
    
    // Debug logging
    if (import.meta.env.DEV) {
      console.log('FINAL LOGIN PAYLOAD:', cleanPayload);
    }
    
    const response = await client.post<AuthResponse>('/api/v1/auth/login', cleanPayload);
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await client.get<User>('/api/v1/auth/me');
    return response.data;
  }
};