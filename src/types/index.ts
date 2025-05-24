export interface User {
	id: string;
	name: string;
	profileImage?: string | null;
	bio?: string | null;
    password?: string;
    verifiedEmail: boolean;
}

export interface Email {
    id: string;
    email: string;
    verified: boolean;
    primary: boolean;
    userId: string;
}