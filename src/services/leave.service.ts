import api from './api';
import type { IResponse } from '../types/academic.types';
import type { ILeaveApplication, IUpdateLeaveStatusPayload, ICreateLeavePayload } from '../types/leave.types';

export const leaveService = {
    getLeaves: async () => {
        const response = await api.get<IResponse<ILeaveApplication[]>>('/leaves');
        return response.data.data;
    },
    updateStatus: async (id: string, data: IUpdateLeaveStatusPayload) => {
        const response = await api.patch<IResponse<ILeaveApplication>>(`/leaves/${id}/status`, data);
        return response.data.data;
    },
    createLeave: async (data: ICreateLeavePayload) => {
        const response = await api.post<IResponse<ILeaveApplication>>('/leaves/create', data);
        return response.data.data;
    },
    deleteLeave: async (id: string) => {
        const response = await api.delete<IResponse<ILeaveApplication>>(`/leaves/${id}`);
        return response.data.data;
    }
};
