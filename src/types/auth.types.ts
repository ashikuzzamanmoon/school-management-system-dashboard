export interface IUser {
    _id: string;
    id: string; // generated ID
    email: string;
    role: 'superAdmin' | 'admin' | 'student';
    status: 'in-progress' | 'blocked';
    passwordChangedAt?: Date;
    name?: string;
    contactNo?: string;
    designation?: string;
    gender?: 'male' | 'female' | 'other';
    dateOfBirth?: string;
    bloodGroup?: string;
    presentAddress?: string;
    permanentAddress?: string;
    profileImg?: string;
    user?: Partial<IUser>;
    student?: {
        name?: string;
        [key: string]: any;
    };
    admin?: {
        name?: string;
        [key: string]: any;
    };
}

export interface ILoginResponse {
    accessToken: string;
    needsPasswordChange: boolean;
}
