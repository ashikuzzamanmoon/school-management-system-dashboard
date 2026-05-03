import api from './api';
import type { IResponse } from '../types/academic.types';
import type { IExam, ICreateExamPayload, IResult, ICreateResultPayload } from '../types/exam.types';

export const examService = {
    createExam: async (data: ICreateExamPayload) => {
        const response = await api.post<IResponse<IExam>>('/exams/create-exam', data);
        return response.data;
    },
    getExams: async (params?: { class?: string }) => {
        const response = await api.get<IResponse<IExam[]>>('/exams', { params });
        return response.data.data;
    },
    updateExam: async (id: string, data: Partial<ICreateExamPayload>) => {
        const response = await api.patch<IResponse<IExam>>(`/exams/${id}`, data);
        return response.data;
    },
    deleteExam: async (id: string) => {
        const response = await api.delete<IResponse<IExam>>(`/exams/${id}`);
        return response.data;
    },
};

export const resultService = {
    createResult: async (data: ICreateResultPayload) => {
        const response = await api.post<IResponse<IResult>>('/results/create-result', data);
        return response.data;
    },
    // Future: getResults logic
    getResults: async (params?: { class?: string; section?: string; examName?: string }) => {
        const response = await api.get<IResponse<IResult[]>>('/results', { params });
        return response.data.data;
    },
    getMyResults: async () => {
        const response = await api.get<IResponse<IResult[]>>('/results/my-result');
        return response.data.data;
    },
    updateResult: async (id: string, data: Partial<ICreateResultPayload>) => {
        const response = await api.patch<IResponse<IResult>>(`/results/${id}`, data);
        return response.data;
    },
    deleteResult: async (id: string) => {
        const response = await api.delete<IResponse<IResult>>(`/results/${id}`);
        return response.data;
    },
};
