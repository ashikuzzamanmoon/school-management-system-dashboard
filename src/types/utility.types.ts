export interface INotice {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    createdAt: string;
}

export interface ICreateNoticePayload {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

export interface IStudyGuide {
    _id: string;
    class: any; // Populated
    section: any; // Populated
    subject: any; // Populated
    date: string;
    topic: string;
    createdAt: string;
}

export interface ICreateStudyGuidePayload {
    class: string;
    section: string;
    subject: string;
    date: string;
    topic: string;
}

export interface IFee {
    _id: string;
    student: any; // Populated
    class: any; // Populated
    section: any; // Populated
    amount: number;
    type: string;
    month: string;
    year: string;
    status: 'Paid' | 'Unpaid';
    transactionId?: string;
    createdAt: string;
}

export interface ICreateFeePayload {
    student: string;
    amount: number;
    type: string;
    month: string;
    year: string;
    status: 'Paid' | 'Unpaid';
    transactionId?: string;
}
