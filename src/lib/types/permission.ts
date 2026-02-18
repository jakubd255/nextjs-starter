export type Role = "ADMIN" | "MODERATOR" |"USER"; 

export type Permission = 
    | "admin:access"
    | "user:read"
    | "user:update:profile"
    | "user:update:security"
    | "user:update:role"
    | "user:delete"
    | "session:terminate"
    | "token:resend"