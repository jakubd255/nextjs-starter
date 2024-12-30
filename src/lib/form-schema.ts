import { z } from "zod";

const email = z.string().email();
const name = z.string().min(2).max(32);
const password = z.string().min(8);

export const loginSchema = z.object({
    email, password
});

export const registerSchema = z.object({
    name, email, password
});

export const verifyEmailSchema = z.object({
    emailId: z.string(),
    code: z.string().length(6)
});

export const updateProfileSchema = z.object({
    name,
    bio: z.string()
});

export const emailIdSchema = z.object({
    emailId: z.string()
});

export const addEmailSchema = z.object({
    email
});

export const addPasswordSchema = z.object({
    password
});

export const updatePasswordSchema = z.object({
    currentPassword: password,
    newPassword: password
});