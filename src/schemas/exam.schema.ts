import { z } from 'zod';

export const createExamSchema = z.object({
    examName: z.string().min(1, 'Exam Name is required'),
    date: z.string().min(1, 'Date is required'),
    subject: z.string().min(1, 'Subject is required'),
    class: z.string().min(1, 'Class is required'),
    section: z.string().min(1, 'Section is required'),
    startTime: z.string().min(1, 'Start Time is required'),
    endTime: z.string().min(1, 'End Time is required'),
});

export type CreateExamFormData = z.infer<typeof createExamSchema>;

export const createResultSchema = z.object({
    class: z.string().min(1, 'Class is required'),
    section: z.string().min(1, 'Section is required'),
    exam: z.string().min(1, 'Exam is required'),
    subject: z.string().min(1, 'Subject is required'),
    student: z.string().min(1, 'Student is required'),
    marks: z.number({ message: "Marks must be a number" }).min(0, 'Min 0').max(100, 'Max 100'),
    grade: z.string().optional(),
});

export type CreateResultFormData = z.infer<typeof createResultSchema>;
