import {z} from 'zod';


export const messageSchema = z.object({
    content: z.string().min(10, 'Message must not be empty or less than 10 characters long').max(500, 'Message must not be more than 500 characters long')
});