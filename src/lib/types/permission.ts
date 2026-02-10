export type Role = "ADMIN" | "MODERATOR" |"USER"; 

export type Permission = 
    | "admin:access"
    | "user:read"
    | "user:update:name"
    | "user:update:bio"
    | "user:update:avatar"
    | "user:update:verified"
    | "user:update:role"
    | "user:update:blocked"
    | "user:delete"
    | "session:terminate"
    | "token:resend"