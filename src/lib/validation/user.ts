import z from "zod";

export const updateProfileSchema = z.object({
    id: z.string().min(10),
    name: z.string().min(2).max(32),
    bio: z.string().nullable().optional()
});