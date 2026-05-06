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
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    presentAddress?: string;
    permanentAddress?: string;
    profileImg?: string;
    user?: Partial<IUser>;
    student?: {
        _id?: string;
        id?: string;
        name?: string;
        email?: string;
        contactNo?: string;
        presentAddress?: string;
        permanentAddress?: string;
    };
    admin?: {
        _id?: string;
        id?: string;
        name?: string;
        email?: string;
        contactNo?: string;
        designation?: string;
        presentAddress?: string;
        permanentAddress?: string;
    };
}

export interface ILoginResponse {
    accessToken: string;
    needsPasswordChange: boolean;
}
