import { z } from "zod";

const email = z.string().email();
const name = z.string().min(2).max(32);
const password = z.string().min(8);

export const logInSchema = z.object({
    email: email, 
    password: password
});

export const registerSchema = z.object({
    name: name, 
    email: email, 
    password: password
});

export const verifyEmailSchema = z.object({
    emailId: z.string(),
    code: z.string().length(6)
});

export const updateProfileSchema = z.object({
    name: name,
    bio: z.string().nullable()
});

export const addEmailSchema = z.object({
    email: email
});

export const updatePasswordSchema = z.object({
    currentPassword: password,
    newPassword: password
});

export const passwordSchema = z.object({
    password: password
});