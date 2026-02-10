export interface SessionFull {
    id: string;
    userId: string;
    os: string;
    browser?: string | null;
    createdAt: Date;
    expiresAt: Date;
}