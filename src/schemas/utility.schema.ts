import { z } from 'zod';

export const createNoticeSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    startDate: z.string().min(1, 'Start Date is required'),
    endDate: z.string().min(1, 'End Date is required'),
});

export const createStudyGuideSchema = z.object({
    class: z.string().min(1, 'Class is required'),
    section: z.string().min(1, 'Section is required'),
    subject: z.string().min(1, 'Subject is required'),
    date: z.string().min(1, 'Date is required'),
    topic: z.string().min(1, 'Topic is required'),
});

export const createFeeSchema = z.object({
    class: z.string().min(1, 'Class is required'),
    section: z.string().min(1, 'Section is required'),
    student: z.string().min(1, 'Student is required'),
    amount: z.number({ message: 'Amount must be a number' }).min(0),
    type: z.string().min(1, 'Type is required'),
    month: z.string().min(1, 'Month is required'),
    year: z.string().min(1, 'Year is required'),
    status: z.enum(['Paid', 'Unpaid']),
    transactionId: z.string().optional(),
}).refine((data) => {
    if (data.status === 'Paid' && !data.transactionId) {
        return false;
    }
    return true;
}, {
    message: "Transaction ID is required for Paid status",
    path: ["transactionId"]
});

export type CreateNoticeFormData = z.infer<typeof createNoticeSchema>;
export type CreateStudyGuideFormData = z.infer<typeof createStudyGuideSchema>;
export type CreateFeeFormData = z.infer<typeof createFeeSchema>;
