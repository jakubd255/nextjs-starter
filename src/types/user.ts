export interface User {
	id: string;
	name: string;
	profileImage?: string | null;
	bio?: string | null;
    password?: string;
    verifiedEmail: boolean;
}