import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { emails } from "./emails";
import { sessions } from "./sessions";

export const users = pgTable("users", {
    id: text().notNull().primaryKey(),
    name: text().notNull(),
    password: text().notNull(),
    profileImage: text(),
    bio: text(),
    verifiedEmail: boolean().notNull().default(false),
    role: text({enum: ["USER", "ADMIN", "MODERATOR"]}).notNull().default("USER"),
    createdAt: timestamp().defaultNow()
});

export const usersRelations = relations(users, ({many}) => ({
    emails: many(emails),
    sessions: many(sessions),
}));