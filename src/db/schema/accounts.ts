import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const accounts = pgTable("accounts", {
    id: text().primaryKey().notNull(),
    userId: text().references(() => users.id, {onDelete: "cascade"}).notNull(),
    provider: text({enum: ["github", "google"]}).notNull(),
    providerUserId: text().notNull(),
    providerUsername: text().notNull(),
    createdAt: timestamp({withTimezone: true}).defaultNow().notNull()
}, (table) => ({
    providerUnique: uniqueIndex().on(table.provider, table.providerUserId)
}));

export const providersRelations = relations(accounts, ({one}) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id]
    })
}));