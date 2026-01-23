import { z } from 'zod';

export const createStudentSchema = z.object({
    password: z.string().max(20, 'Password cannot be more than 20 characters').optional(),
    student: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
        roll: z.string().min(1, 'Roll number is required'),
        class: z.string().min(1, 'Class is required'),
        section: z.string().min(1, 'Section is required'),
        guardianPhone: z.string().min(1, 'Guardian phone is required'),
    }),
});

export type CreateStudentResult = z.infer<typeof createStudentSchema>;
