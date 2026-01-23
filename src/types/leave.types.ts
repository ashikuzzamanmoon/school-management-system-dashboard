export interface ILeaveApplication {
    _id: string;
    student: any; // Populated
    subject: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: string;
}

export interface IUpdateLeaveStatusPayload {
    status: 'Approved' | 'Rejected';
}

export interface ICreateLeavePayload {
    student: string; // Student ID
    subject: string;
    description: string;
    startDate: string;
    endDate: string;
}
