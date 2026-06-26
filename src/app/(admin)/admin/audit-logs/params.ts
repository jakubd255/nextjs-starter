import { AuditAction } from "@/db/schema/audit-logs";
import { parseBaseParams, CommonSearchParams } from "@/db/filters/generic";

export interface AuditLogSearchParams extends CommonSearchParams {
    actorId?: string;
    targetUserId?: string;
    action?: AuditAction | AuditAction[];
}

export const parseAuditLogParams = (params: AuditLogSearchParams) => ({
    ...parseBaseParams(params),
    actorId: params.actorId || undefined,
    targetUserId: params.targetUserId || undefined,
    action: params.action ? (Array.isArray(params.action) ? params.action : [params.action]) : undefined
});