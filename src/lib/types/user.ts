import { Email } from "./email";

export interface User {
	id: string;
	name: string;
	profileImage?: string | null;
	bio?: string | null;
    password?: string;
	role: Role;
	emails?: Email[];
}

export type Role = "USER" | "ADMIN" | "MODERATOR";