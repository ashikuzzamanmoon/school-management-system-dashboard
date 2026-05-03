import api from './api';
import type { IResponse } from '../types/academic.types';
import type { INotice, ICreateNoticePayload, IStudyGuide, ICreateStudyGuidePayload, IFee, ICreateFeePayload } from '../types/utility.types';

export const noticeService = {
    createNotice: async (data: ICreateNoticePayload) => {
        const response = await api.post<IResponse<INotice>>('/notices/create-notice', data);
        return response.data;
    },
    getNotices: async () => {
        const response = await api.get<IResponse<INotice[]>>('/notices');
        return response.data.data;
    },
    updateNotice: async (id: string, data: Partial<ICreateNoticePayload>) => {
        const response = await api.patch<IResponse<INotice>>(`/notices/${id}`, data);
        return response.data;
    },
    deleteNotice: async (id: string) => {
        const response = await api.delete<IResponse<INotice>>(`/notices/${id}`);
        return response.data;
    },
};

export const studyGuideService = {
    createStudyGuide: async (data: ICreateStudyGuidePayload) => {
        const response = await api.post<IResponse<IStudyGuide>>('/study-guides/create-study-guide', data);
        return response.data;
    },
    getStudyGuides: async (params?: { class?: string; date?: string }) => {
        const response = await api.get<IResponse<IStudyGuide[]>>('/study-guides', { params });
        return response.data.data;
    },
    updateStudyGuide: async (id: string, data: Partial<ICreateStudyGuidePayload>) => {
        const response = await api.patch<IResponse<IStudyGuide>>(`/study-guides/${id}`, data);
        return response.data;
    },
    deleteStudyGuide: async (id: string) => {
        const response = await api.delete<IResponse<IStudyGuide>>(`/study-guides/${id}`);
        return response.data;
    },
};

export const feeService = {
    createFee: async (data: ICreateFeePayload) => {
        const response = await api.post<IResponse<IFee>>('/fees/create-fee', data);
        return response.data;
    },
    getFees: async () => {
        const response = await api.get<IResponse<IFee[]>>('/fees');
        return response.data.data;
    },
    getMyFees: async () => {
        const response = await api.get<IResponse<IFee[]>>('/fees/my-fees');
        return response.data.data;
    },
    updateFee: async (id: string, data: Partial<ICreateFeePayload>) => {
        const response = await api.patch<IResponse<IFee>>(`/fees/${id}`, data);
        return response.data;
    },
    deleteFee: async (id: string) => {
        const response = await api.delete<IResponse<IFee>>(`/fees/${id}`);
        return response.data;
    },
};
