export type TokenType = "EMAIL_VERIFICATION" | "RESET_PASSWORD";

export interface Token {
    id: string;
    code: string;
    userId: string;
    type: TokenType;
    expiresAt: Date;
}