import { createOAuthAccount, getUserByOAuthAccount } from "@/db/queries/accounts";
import { createUser, getUserByEmail, updateUser } from "@/db/queries/users";
import { OAuthProvider } from "@/lib/types";
import { Session } from "lucia";

interface HandleOAuthParams {
    provider: OAuthProvider;
    providerUserId: string;
	providerUsername: string;
    email: string;
    name: string;
    profileImage?: string | null;
    session?: Session | null;
}

export async function handleOAuthLoginOrRegister(params: HandleOAuthParams): Promise<string | null> {
	const {provider, providerUserId, providerUsername, email, name, profileImage, session} = params;

	const existingAccount = await getUserByOAuthAccount(provider, providerUserId);
	if(existingAccount?.user) {
        return existingAccount.userId;
    }

	//If user logged in - linking accounts
	if(session?.userId) {
		await createOAuthAccount(session.userId, provider, providerUserId, providerUsername);
		return session.userId;
	}

	//If user not logged in - registration
	const existingUser = await getUserByEmail(email);
	if(!existingUser) {
		const user = await createUser(name, email, null, "USER", true);
		if(profileImage) {
			await updateUser(user.id, {profileImage});
		}
		await createOAuthAccount(user.id, provider, providerUserId, email);
		return user.id;
	}
	else if(!existingUser.verified) {
		await updateUser(existingUser.id, {verified: true, name, profileImage});
		await createOAuthAccount(existingUser.id, provider, providerUserId, email);
		return existingUser.id;
	}
	
	return null;
}