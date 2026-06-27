import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const TOKEN_TYPES = ["RESET_PASSWORD", "EMAIL_VERIFICATION"] as const;

export const tokens = pgTable("tokens", {
    id: text().primaryKey().notNull(),
    code: text().notNull(),
    userId: text().references(() => users.id, {onDelete: "cascade"}).notNull(),
    type: text({enum: TOKEN_TYPES}).notNull(),
    expiresAt: timestamp({withTimezone: true}).notNull()
});

export type TokenType = typeof TOKEN_TYPES[number];
export type Token = typeof tokens.$inferSelect;

export const tokensRelations = relations(tokens, ({one}) => ({
    user: one(users, {
        fields: [tokens.userId],
        references: [users.id],
    })
}));