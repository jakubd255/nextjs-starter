import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { emails } from "./emails";
import { relations } from "drizzle-orm";

export const tokens = pgTable("tokens", {
    id: text().notNull().primaryKey(),
    code: text().notNull(),
    emailId: text().notNull().references(() => emails.id),
    expiresAt: timestamp().notNull()
});

export const tokensRelations = relations(tokens, ({one}) => ({
    email: one(emails, {
        fields: [tokens.emailId],
        references: [emails.id],
    })
}));