import api from './api';
import type { IResponse } from '../types/academic.types';
import type { IStudent } from '../types/student.types';
import type { IUser } from '../types/auth.types';
import type { CreateAdminResult } from '../schemas/admin.schema';
import type { CreateStudentResult } from '../schemas/student.schema';

export const userService = {
    createAdmin: async (data: CreateAdminResult) => {
        const response = await api.post<IResponse<unknown>>('/users/create-admin', data);
        return response.data;
    },
    getAllAdmins: async () => {
        const response = await api.get<IResponse<IUser[]>>('/admins');
        return response.data.data;
    },
    getSingleAdmin: async (id: string) => {
        const response = await api.get<IResponse<IUser>>(`/admins/${id}`);
        return response.data.data;
    },
    updateAdmin: async (id: string, data: Partial<CreateAdminResult['admin']>) => {
        const response = await api.patch<IResponse<IUser>>(`/admins/${id}`, data);
        return response.data.data;
    },
    deleteAdmin: async (id: string) => {
        const response = await api.delete<IResponse<IUser>>(`/admins/${id}`);
        return response.data.data;
    },
    createStudent: async (data: CreateStudentResult) => {
        const response = await api.post<IResponse<unknown>>('/users/create-student', data);
        return response.data;
    },
    getAllStudents: async (params?: Record<string, string>) => {
        const response = await api.get<IResponse<IStudent[]>>('/students', { params });
        return response.data.data;
    },
    deleteStudent: async (id: string) => {
        const response = await api.delete<IResponse<IStudent>>(`/students/${id}`);
        return response.data.data;
    },
    updateStudent: async (id: string, data: Partial<CreateStudentResult['student']>) => {
        const response = await api.patch<IResponse<IStudent>>(`/students/${id}`, data);
        return response.data.data;
    },
    getMe: async () => {
        const response = await api.get<IResponse<IUser>>('/users/me');
        return response.data.data;
    },
    updateMe: async (data: Partial<IUser>) => {
        const response = await api.patch<IResponse<IUser>>('/users/me', data);
        return response.data.data;
    },
};
