import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const providers = pgTable("providers", {
    id: text().primaryKey().notNull(),
    userId: text().references(() => users.id, {onDelete: "cascade"}).notNull(),
    provider: text().notNull(),
    providerUserId: text().notNull(),
    providerUsername: text().notNull(),
    createdAt: timestamp({withTimezone: true}).defaultNow().notNull()
}, (table) => ({
    providerUnique: uniqueIndex().on(
        table.provider,
        table.providerUserId
    )
}));

export const providersRelations = relations(providers, ({one}) => ({
    user: one(users, {
        fields: [providers.userId],
        references: [users.id],
    })
}));