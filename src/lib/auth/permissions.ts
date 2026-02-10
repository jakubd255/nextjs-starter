import { Permission, Role, User } from "../types";

export const ROLES = ["USER", "MODERATOR", "ADMIN"] as const;

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    USER: [],
    MODERATOR: [
        "admin:access",
        "user:read",
        "user:update:bio",
        "user:update:avatar",
    ],
    ADMIN: [
        "admin:access",
        "user:read",
        "user:update:name",
        "user:update:bio",
        "user:update:avatar",
        "user:update:verified",
        "user:update:role",
        "user:update:blocked",
        "user:delete",
        "session:terminate",
        "token:resend"
    ]
};

export const hasPermission = (user: User | null | undefined, permission: Permission): boolean => {
    if(!user) return false;
    if (user.blocked) return false;

    const permissions = ROLE_PERMISSIONS[user.role] ?? [];
    return permissions.includes(permission);
}