import { createSessionCookie } from "@/lib/auth";
import { getGithubUser, getUserEmail, github } from "@/lib/auth/github";
import { validateRequest } from "@/lib/auth/lucia";
import { createGitHubAccount, getGitHubAccountAndUser } from "@/lib/db/account";
import { createEmail, findEmailAndUser, updateEmail } from "@/lib/db/email";
import { createUser } from "@/lib/db/user";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";

export const GET = async (request: Request): Promise<Response> => {
	let userId: string;
    const url = new URL(request.url);

	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = (await cookies()).get("github_oauth_state")?.value ?? null;

	if(!code || !state || !storedState || state !== storedState) {
		return new Response(null, {status: 400});
	}

    try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUser = await getGithubUser(tokens);

		//If GitHub account exists
		const existingGithubAccount = await getGitHubAccountAndUser(githubUser);
		if(existingGithubAccount?.user) {
			await createSessionCookie(existingGithubAccount.user.id);
			return new Response(null, {status: 302, headers: {Location: "/"}});
		}

		//If user is logged in
		const {user} = await validateRequest();
		if(!existingGithubAccount && user) {
			await createGitHubAccount(user.id, githubUser);
			await createSessionCookie(user.id);
        	return new Response(null, {status: 302, headers: {Location: "/settings/account"}});
		}

		//If not public email - fetch primary email
		if(!githubUser.email) {
			githubUser.email = await getUserEmail(tokens);
		}

		const userEmail = await findEmailAndUser(githubUser.email);

		//Email doesn't exist - create new user and associate email
		if(!userEmail) {
			const user = await createUser(githubUser.name, githubUser.avatar_url, null);
			await createEmail(githubUser.email, user.id);
			userId = user.id;
		}

		//Email exists but is unverified - create new user and update email
		else if(userEmail.user && !userEmail.verified) {
			const user = await createUser(githubUser.name, githubUser.avatar_url, null);
			await updateEmail(userEmail.id, {userId: user.id, verified: true, primary: true});
			userId = user.id;
		}

		//Email exists and is verified - link to the existing user
		else if(userEmail.user && userEmail.verified) {
			userId = userEmail.user.id;
		}
		
		else {
			throw Error("Something went wrong");
		}

		await createGitHubAccount(userId, githubUser);
		await createSessionCookie(userId);
        return new Response(null, {status: 302, headers: {Location: "/"}});
    }
    catch(error) {
		console.log(error);

		if(error instanceof OAuth2RequestError) {
			return new Response(null, {status: 400});
		}
		return new Response(null, {status: 500});
    }
}