import {z} from 'zod';

export const signinSchema = z.object({
    identifier: z.string()
        .min(3, 'Identifier must be at least 3 characters')
        .refine((value) => {
            // Check if value is email or username
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            return emailRegex.test(value) || usernameRegex.test(value);
        }, "Please enter a valid email or username"),
    password: z.string()
        .min(6, 'Password must be at least 6 characters long')
});