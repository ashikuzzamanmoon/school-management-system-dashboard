import type { IClass, ISection, ISubject } from './academic.types';

export type TRoutineDays = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface IRoutine {
    _id: string;
    class: IClass;
    section: ISection;
    subject: ISubject;
    day: TRoutineDays;
    startTime: string;
    endTime: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICreateRoutinePayload {
    class: string;
    section: string;
    subject: string;
    day: TRoutineDays;
    startTime: string;
    endTime: string;
}
