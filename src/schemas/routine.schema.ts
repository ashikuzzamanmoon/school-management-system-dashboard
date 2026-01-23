import { z } from 'zod';

export const createRoutineSchema = z.object({
    class: z.string().min(1, 'Class is required'),
    section: z.string().min(1, 'Section is required'),
    subject: z.string().min(1, 'Subject is required'),
    day: z.enum(['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
}).refine((data) => {
    // Simple string comparison for HH:MM format works for same day
    return data.endTime > data.startTime;
}, {
    message: "End time must be after start time",
    path: ["endTime"]
});

export type CreateRoutineFormData = z.infer<typeof createRoutineSchema>;
