import api from './api';
import type { IClass, ISection, ISubject, IResponse } from '../types/academic.types';

export const academicService = {
    // Class
    getClasses: async () => {
        const response = await api.get<IResponse<IClass[]>>('/classes');
        return response.data.data;
    },
    createClass: async (data: { name: string }) => {
        const response = await api.post<IResponse<IClass>>('/classes/create-class', data);
        return response.data;
    },
    updateClass: async (id: string, data: { name: string }) => {
        const response = await api.patch<IResponse<IClass>>(`/classes/${id}`, data);
        return response.data;
    },
    deleteClass: async (id: string) => {
        const response = await api.delete<IResponse<IClass>>(`/classes/${id}`);
        return response.data;
    },

    // Section
    getSections: async (params?: Record<string, any>) => {
        const response = await api.get<IResponse<ISection[]>>('/sections', { params });
        return response.data.data;
    },
    createSection: async (data: { name: string }) => {
        const response = await api.post<IResponse<ISection>>('/sections/create-section', data);
        return response.data;
    },
    updateSection: async (id: string, data: { name: string }) => {
        const response = await api.patch<IResponse<ISection>>(`/sections/${id}`, data);
        return response.data;
    },
    deleteSection: async (id: string) => {
        const response = await api.delete<IResponse<ISection>>(`/sections/${id}`);
        return response.data;
    },

    // Subject
    getSubjects: async () => {
        const response = await api.get<IResponse<ISubject[]>>('/subjects');
        return response.data.data;
    },
    createSubject: async (data: { name: string; code: string }) => {
        const response = await api.post<IResponse<ISubject>>('/subjects/create-subject', data);
        return response.data;
    },
    updateSubject: async (id: string, data: { name: string; code: string }) => {
        const response = await api.patch<IResponse<ISubject>>(`/subjects/${id}`, data);
        return response.data;
    },
    deleteSubject: async (id: string) => {
        const response = await api.delete<IResponse<ISubject>>(`/subjects/${id}`);
        return response.data;
    },
};
