import { AuditAction } from "@/db/schema/audit-logs";

export interface AuditLog {
    id: string;
    actorId?: string | null;
    targetUserId?: string | null;
    action: AuditAction;
    //metadata?: Record<string, unknown> | null;
    ip?: string | null;
    device: {
        os: string;
        browser?: string | null;
    } | null;
    createdAt: Date;
}