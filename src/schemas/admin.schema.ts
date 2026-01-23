import { z } from 'zod';

export const createAdminSchema = z.object({
    password: z.string().optional(),
    admin: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
        contactNo: z.string().min(1, 'Contact number is required'),
        designation: z.string().min(1, 'Designation is required'),
        gender: z.enum(['male', 'female', 'other']),
        dateOfBirth: z.string().optional(), // Date input returns string usually
        bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
        presentAddress: z.string().min(1, 'Present address is required'),
        permanentAddress: z.string().min(1, 'Permanent address is required'),
        profileImg: z.string().url('Invalid URL').optional().or(z.literal('')),
    }),
});

export type CreateAdminResult = z.infer<typeof createAdminSchema>;
