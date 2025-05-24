import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { emails } from "./emails";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const tokens = pgTable("tokens", {
    id: text().notNull().primaryKey(),
    code: text().notNull(),
    emailId: text().references(() => emails.id),
    userId: text().references(() => users.id),
    type: text({enum: ["RESET_PASSWORD", "EMAIL_VERIFICATION"]}).notNull(),
    expiresAt: timestamp().notNull()
});

export const tokensRelations = relations(tokens, ({one}) => ({
    email: one(emails, {
        fields: [tokens.emailId],
        references: [emails.id],
    }),
    user: one(users, {
        fields: [tokens.userId],
        references: [users.id],
    })
}));