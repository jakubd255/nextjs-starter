import { Lucia } from "lucia";
import { User } from "../types";
import { adapter } from "@/db";

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: User;
    }
}

const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            sameSite: "lax",
            path: "/",
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes(databaseUserAttributes) {
        return {
            id: databaseUserAttributes.id,
            name: databaseUserAttributes.name,
            email: databaseUserAttributes.email,
            pendingEmail: databaseUserAttributes.pendingEmail,
            verified: databaseUserAttributes.verified,
            profileImage: databaseUserAttributes.profileImage,
            bio: databaseUserAttributes.bio,
            hasPassword: !!databaseUserAttributes.password,
            role: databaseUserAttributes.role,
            blocked: databaseUserAttributes.blocked,
            createdAt: databaseUserAttributes.createdAt
        }
    },
});
export default lucia;