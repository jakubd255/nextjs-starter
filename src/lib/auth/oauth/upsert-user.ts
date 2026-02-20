import { createOAuthProvider, getUserByOAuthProvider } from "@/db/queries/providers";
import { createUser, getUserByEmail, updateUser } from "@/db/queries/users";

interface UpsertOAuthUserParams {
	provider: string;
	providerUserId: string;
	email: string;
	name: string;
	profileImage?: string | null;
	bio?: string | null;
	providerUsername: string;
}

export async function upsertOAuthUser({provider, providerUserId, email, name, profileImage, bio, providerUsername}: UpsertOAuthUserParams) {
    const existingProvider = await getUserByOAuthProvider(provider, providerUserId);

    if(existingProvider?.user) {
		return existingProvider.userId;
	}

	const existingUser = await getUserByEmail(email);
	let userId: string;

    if(!existingUser) {
		const user = await createUser(name, email, null, "USER", true);
		await updateUser(user.id, {profileImage, bio});
		userId = user.id;
	}
    else if(!existingUser.verified) {
		await updateUser(existingUser.id, {verified: true, name, profileImage, bio});
		userId = existingUser.id;
	}
    else {
		userId = existingUser.id;
	}
    
    try {
		await createOAuthProvider(userId, provider, providerUserId, providerUsername);
	}
	catch(error) {
		const afterRace = await getUserByOAuthProvider(provider, providerUserId);
		if(afterRace?.user) {
			return afterRace.userId;
		}
		throw error;
	}

	return userId;
}