import { Role } from "./permission";

export interface User {
    id: string;
    name: string;
    email: string;
    pendingEmail?: string | null;
    verified: boolean;
    password?: string | null;
    profileImage?: string | null;
    bio?: string | null;
    role: Role;
    blocked: boolean;
    createdAt: Date;
}