import api from './api';
import type { IResponse } from '../types/academic.types';
import type { CreateStudentResult } from '../schemas/student.schema';

export const userService = {
    createAdmin: async (data: any) => {
        const response = await api.post<IResponse<any>>('/users/create-admin', data);
        return response.data;
    },
    getAllAdmins: async () => {
        const response = await api.get<IResponse<any[]>>('/admins');
        return response.data.data;
    },
    getSingleAdmin: async (id: string) => {
        const response = await api.get<IResponse<any>>(`/admins/${id}`);
        return response.data.data;
    },
    updateAdmin: async (id: string, data: any) => {
        const response = await api.patch<IResponse<any>>(`/admins/${id}`, data);
        return response.data.data;
    },
    deleteAdmin: async (id: string) => {
        const response = await api.delete<IResponse<any>>(`/admins/${id}`);
        return response.data.data;
    },
    createStudent: async (data: CreateStudentResult) => {
        const response = await api.post<IResponse<any>>('/users/create-student', data);
        return response.data;
    },
    getAllStudents: async (params?: Record<string, any>) => {
        const response = await api.get<IResponse<any[]>>('/students', { params });
        return response.data.data;
    },
    deleteStudent: async (id: string) => {
        const response = await api.delete<IResponse<any>>(`/students/${id}`);
        return response.data.data;
    },
    updateStudent: async (id: string, data: Partial<CreateStudentResult['student']>) => {
        const response = await api.patch<IResponse<any>>(`/students/${id}`, data);
        return response.data.data;
    },
    getMe: async () => {
        const response = await api.get<IResponse<any>>('/users/me');
        return response.data.data;
    },
    updateMe: async (data: any) => {
        const response = await api.patch<IResponse<any>>('/users/me', data);
        return response.data.data;
    },
};
