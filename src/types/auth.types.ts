export interface IUser {
    _id: string;
    id: string; // generated ID
    email: string;
    role: 'superAdmin' | 'admin' | 'student';
    status: 'in-progress' | 'blocked';
    passwordChangedAt?: Date;
}

export interface ILoginResponse {
    accessToken: string;
    needsPasswordChange: boolean;
}
