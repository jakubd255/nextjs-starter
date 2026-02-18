import { ROLES } from "@/lib/auth/permissions";
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { sessions } from "./sessions";
import { tokens } from "./tokens";
import { providers } from "./providers";

export const users = pgTable("users", {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    email: text().unique().notNull(),
    pendingEmail: text(),
    verified: boolean().default(false).notNull(),
    password: text(),
    profileImage: text(),
    bio: text(),
    role: text({enum: ROLES}).default("USER").notNull(),
    blocked: boolean().default(false).notNull(),
    createdAt: timestamp({withTimezone: true}).defaultNow().notNull()
});

export const usersRelations = relations(users, ({many}) => ({
    sessions: many(sessions),
    tokens: many(tokens),
    providers: many(providers)
}));