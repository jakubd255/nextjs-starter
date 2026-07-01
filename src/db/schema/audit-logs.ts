import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const AUDIT_ACTIONS = [
    "LOGIN_SUCCESS",
    "LOGIN_FAILED",
    "PASSWORD_RESET_REQUEST",
    "PASSWORD_RESET_SUCCESS",
    "EMAIL_CHANGED",
    "ROLE_CHANGED",
    "USER_BLOCKED",
    "USER_UNLOCKED",
    "USER_DELETED",
    "FORCE_LOGOUT"
] as const;

export type AuditAction = typeof AUDIT_ACTIONS[number];

export const auditLogs = pgTable("audit_logs", {
    id: text().primaryKey().notNull(),
    actorId: text().references(() => users.id, {onDelete: "set null"}),
    targetUserId: text().references(() => users.id, {onDelete: "cascade"}),
    action: text({ enum: AUDIT_ACTIONS }).notNull(),
    metadata: jsonb().$type<Record<string, unknown>>(),
    ip: text(),
    device: jsonb().$type<{
        os: string;
        browser?: string | null;
    }>(),
    createdAt: timestamp({withTimezone: true}).defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;

export const auditLogsRelations = relations(auditLogs, ({one}) => ({
    user: one(users, {
        fields: [auditLogs.actorId, auditLogs.targetUserId],
        references: [users.id, users.id]
    })
}));