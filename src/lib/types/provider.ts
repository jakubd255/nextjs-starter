import { User } from "./user";

export interface Provider {
    id: string;
    userId: string;
    provider: string;
    providerUserId: string;
    providerUsername: string;
    createdAt: Date;
    user?: User | null;
}