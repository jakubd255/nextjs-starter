import { User } from "lucia";

export const ROLES = ["USER", "MODERATOR", "ADMIN"] as const;

export const PERMISSIONS = [
    "admin:access",
    "user:read",
    "user:update:profile",
    "user:update:security",
    "user:update:role",
    "user:delete",
    "session:terminate",
    "token:resend",
    "oauth:read",
    "oauth:disconnect",
    "audit:read"
] as const;

export type Role = typeof ROLES[number];
export type Permission = typeof PERMISSIONS[number];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    USER: [],
    MODERATOR: [
        "admin:access",
        "user:read",
        "user:update:profile"
    ],
    ADMIN: [...PERMISSIONS]
};

export const hasPermission = (user: User | null | undefined, permission: Permission): boolean => {
    if(!user) return false;
    if(user.blocked) return false;

    const permissions = ROLE_PERMISSIONS[user.role] ?? [];
    return permissions.includes(permission);
}