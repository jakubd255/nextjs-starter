import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const tokens = pgTable("tokens", {
    id: text().primaryKey().notNull(),
    code: text().notNull(),
    userId: text().references(() => users.id),
    type: text({enum: ["RESET_PASSWORD", "EMAIL_VERIFICATION"]}).notNull(),
    expiresAt: timestamp({withTimezone: true}).notNull()
});

export const tokensRelations = relations(tokens, ({one}) => ({
    user: one(users, {
        fields: [tokens.userId],
        references: [users.id],
    })
}));