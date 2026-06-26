import { auditLogs } from "../schema";
import { buildGenericWhere, createOrderBy } from "./generic";
import { or, ilike, sql, and } from "drizzle-orm";

const auditLogSearchColumns = [
    auditLogs.id, 
    auditLogs.actorId, 
    auditLogs.targetUserId, 
    auditLogs.ip,
    auditLogs.action
];

const auditLogSortMap = {
    id: auditLogs.id,
    createdAt: auditLogs.createdAt,
    action: auditLogs.action,
    ip: auditLogs.ip,
};

export const buildAuditLogSearchWhere = (filters: any) => {
    const {search, ...exactFilters} = filters;

    const exactWhere = buildGenericWhere(exactFilters, {
        exactMatches: {actorId: auditLogs.actorId, targetUserId: auditLogs.targetUserId},
        arrayMatches: {action: auditLogs.action}
    });

    if(search) {
        const searchConditions = or(
            ...auditLogSearchColumns.map(col => ilike(col, `%${search}%`)),
            ilike(sql`${auditLogs.device}->>'os'`, `%${search}%`),
            ilike(sql`${auditLogs.device}->>'browser'`, `%${search}%`)
        );

        return exactWhere ? and(exactWhere, searchConditions) : searchConditions;
    }

    return exactWhere;
};

export const getAuditLogOrderBy = (field?: string, order?: string) => createOrderBy(auditLogSortMap, field, order);