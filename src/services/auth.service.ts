import type { ILoginResponse } from '../types/auth.types';
import api from './api';
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const authService = {
    login: async (data: LoginFormData) => {
        // Note: Backend expects { email, password } for login
        const response = await api.post<{ success: boolean; message: string; data: ILoginResponse }>('/auth/login', data);
        return response.data;
    },
    changePassword: async (data: any) => {
        const response = await api.post('/auth/change-password', data);
        return response.data;
    },
};
