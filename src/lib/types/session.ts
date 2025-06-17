export interface SessionFull {
    id: string;
    userId: string;
    os: string;
    browser?: string | null;
    createdAt?: Date | null;
    expiresAt: Date;
}