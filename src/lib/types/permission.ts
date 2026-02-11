export type Role = "ADMIN" | "MODERATOR" |"USER"; 

export type Permission = 
    | "admin:access"
    | "user:read"
    | "user:update:profile"
    | "user:update:verified"
    | "user:update:role"
    | "user:update:blocked"
    | "user:delete"
    | "session:terminate"
    | "token:resend"