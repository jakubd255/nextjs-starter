export interface Session {
    id: string;
    userId: string;
    os: string;
    browser?: string | null;
    createdAt: Date;
    expiresAt: Date;
}