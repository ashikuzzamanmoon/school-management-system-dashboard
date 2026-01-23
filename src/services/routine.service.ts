import api from './api';
import type { IResponse } from '../types/academic.types';
import type { IRoutine, ICreateRoutinePayload } from '../types/routine.types';

export const routineService = {
    createRoutine: async (data: ICreateRoutinePayload) => {
        const response = await api.post<IResponse<IRoutine>>('/routines/create-routine', data);
        return response.data;
    },
    getRoutines: async (params?: { class?: string; section?: string }) => {
        const response = await api.get<IResponse<IRoutine[]>>('/routines', { params });
        return response.data.data;
    },
    getSingleRoutine: async (id: string) => {
        const response = await api.get<IResponse<IRoutine>>(`/routines/${id}`);
        return response.data.data;
    },
    updateRoutine: async (id: string, data: Partial<ICreateRoutinePayload>) => {
        const response = await api.patch<IResponse<IRoutine>>(`/routines/${id}`, data);
        return response.data;
    },
    deleteRoutine: async (id: string) => {
        const response = await api.delete<IResponse<IRoutine>>(`/routines/${id}`);
        return response.data;
    },
};
