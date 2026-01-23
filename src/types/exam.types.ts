import type { IClass, ISection, ISubject } from './academic.types';
import type { IStudent } from './student.types';

export interface IExam {
    _id: string;
    examName: string;
    date: string; // ISO Date string
    subject: ISubject; // Populated
    class: IClass; // Populated
    section: ISection; // Populated
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateExamPayload {
    examName: string;
    date: string;
    subject: string;
    class: string;
    section: string;
    startTime: string;
    endTime: string;
}

export interface IResult {
    _id: string;
    student: IStudent; // Populated usually, or ID
    examName: string;
    subject: ISubject | string;
    marks: number;
    grade?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateResultPayload {
    student: string;
    class: string;
    section: string;
    exam: string;
    subject: string;
    marks: number;
    grade?: string;
}
