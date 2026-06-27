import { generateIdFromEntropySize } from "lucia";
import { AuditAction, auditLogs } from "../schema/audit-logs";
import { getClientIp, getDeviceInfo } from "@/lib/auth/session";
import db from "..";
import { parseAuditLogParams } from "@/app/(admin)/admin/audit-logs/params";
import { buildAuditLogSearchWhere, getAuditLogOrderBy } from "../filters/audit-logs";
import { countTableRows } from "../filters/generic";

const createAuditLog = async (actorId: string | null, targetUserId: string | null, action: AuditAction, metadata?: Record<string, unknown> | null) => {
    const id = generateIdFromEntropySize(10);
    const device = await getDeviceInfo();
    const ip = await getClientIp();

    const [res] = await db
        .insert(auditLogs)
        .values({id, actorId, targetUserId, action, metadata, device, ip})
        .returning();
    return res;
}

export const logLogInSuccess = async (actorId: string) => {
    return createAuditLog(actorId, null, "LOGIN_SUCCESS", null);
}

export const logLogInFailed = async (actorId: string | null, email: string) => {
    return createAuditLog(actorId, null, "LOGIN_FAILED", {email});
}

export const logPasswordResetRequest = async (userId: string) => {
    return createAuditLog(userId, userId, "PASSWORD_RESET_REQUEST");
}

export const logPasswordResetSuccess = async (userId: string) => {
    return createAuditLog(userId, userId, "PASSWORD_RESET_SUCCESS");
}

export const logRoleChange = async (adminId: string, targetUserId: string, fromRole: string,toRole: string) => {
    return createAuditLog(adminId, targetUserId, "ROLE_CHANGED", {fromRole, toRole});
}

export const logUserBlocked = async (adminId: string, targetUserId: string) => {
    return createAuditLog(adminId, targetUserId, "USER_BLOCKED");
}

export const logUserUnlocked = async (adminId: string, targetUserId: string) => {
    return createAuditLog(adminId, targetUserId, "USER_UNLOCKED");
}

export const logUserDeleted = async (adminId: string, targetUserId: string) => {
    return createAuditLog(adminId, targetUserId, "USER_DELETED");
}

export const logForceLogout = async (adminId: string, targetUserId: string) => {
    return createAuditLog(adminId, targetUserId, "FORCE_LOGOUT");
}

export const logEmailChange = async (userId: string, oldEmail: string, newEmail: string) => {
    return createAuditLog(userId, userId, "EMAIL_CHANGED", {oldEmail, newEmail});
}

export const getAuditLogs = async () => {
    return await db.query.auditLogs.findMany();
}

export const getAuditLogsAdmin = async (parsedParams: ReturnType<typeof parseAuditLogParams>) => {
    const where = buildAuditLogSearchWhere(parsedParams);

    return await db.query.auditLogs.findMany({
        where: where,
        limit: parsedParams.pageSize,
        offset: (parsedParams.page - 1) * parsedParams.pageSize,
        orderBy: getAuditLogOrderBy(parsedParams.sortField, parsedParams.sortOrder),
    });
};

export const countAuditLogsAdmin = async (filters: any) => {
    return countTableRows(db, auditLogs, buildAuditLogSearchWhere(filters));
}