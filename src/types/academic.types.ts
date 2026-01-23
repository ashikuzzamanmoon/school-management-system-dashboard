export interface IClass {
    _id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ISection {
    _id: string;
    name: string;
    class: IClass | string; // It can be populated object or ID string
    createdAt?: string;
    updatedAt?: string;
}

export interface ISubject {
    _id: string;
    name: string;
    code: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
