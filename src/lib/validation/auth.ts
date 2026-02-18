import z from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    redirectTo: z.string().optional().nullable()
});

export const registerSchema = z.object({
    name: z.string().min(2).max(32),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
})
.refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export const passwordSchema = z.object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
})
.refine(data => {return data.password === data.confirmPassword}, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export const resetPasswordSchema = z.object({
    code: z.string().min(8),
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8)
})
.refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"]
});

export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8)
})
.refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"]
});

export const updateEmailSchema = z.object({
    email: z.email()
});

export const verifyEmailSchema = z.object({
    userId: z.string(),
    code: z.string().length(8)
});