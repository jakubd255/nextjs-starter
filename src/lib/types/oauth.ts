import { User } from "./user";

export type OAuthProvider = "github" | "google";

export interface OAuthAccount {
    id: string;
    userId: string;
    provider: OAuthProvider;
    providerUserId: string;
    providerUsername: string;
    createdAt: Date;
    user?: User | null;
}