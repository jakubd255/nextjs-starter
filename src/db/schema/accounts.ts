import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const OAUTH_PROVIDERS = ["github", "google"] as const;

export const accounts = pgTable("accounts", {
    id: text().primaryKey().notNull(),
    userId: text().references(() => users.id, {onDelete: "cascade"}).notNull(),
    provider: text({enum: OAUTH_PROVIDERS}).notNull(),
    providerUserId: text().notNull(),
    providerUsername: text().notNull(),
    createdAt: timestamp({withTimezone: true}).defaultNow().notNull()
}, (table) => ({
    providerUnique: uniqueIndex().on(table.provider, table.providerUserId)
}));

export type OAuthProvider = typeof OAUTH_PROVIDERS[number];
export type OAuthAccount = typeof accounts.$inferSelect;

export const accountsRelations = relations(accounts, ({one}) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id]
    })
}));