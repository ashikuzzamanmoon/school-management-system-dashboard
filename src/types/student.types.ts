import type { IClass, ISection } from './academic.types';
import type { IUser } from './auth.types';

export interface IStudent {
    _id: string;
    user: IUser; // Populated user
    name: string;
    roll: string;
    class: IClass; // Populated class
    section: ISection; // Populated section
    guardianPhone: string;
    createdAt?: string;
    updatedAt?: string;
}
