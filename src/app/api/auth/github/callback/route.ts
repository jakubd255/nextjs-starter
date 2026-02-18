import { getUserByOAuthProvider } from "@/db/queries/providers";
import { createSessionCookie, validateRequest } from "@/lib/auth";
import { github } from "@/lib/auth/oauth";
import { getDeviceInfo } from "@/lib/auth/device-info";
import { OAuth2Tokens } from "arctic";
import { cookies } from "next/headers";
import { upsertOAuthUser } from "@/lib/auth/oauth/upsert-user";
import { getGithubUserEmail } from "@/lib/auth/oauth/github-email";
import { decodeState } from "@/lib/auth/oauth/state";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const cookieStore = await cookies();
	const storedState = cookieStore.get("github_oauth_state")?.value ?? null;

    if(!code || !state || !storedState) {
		return new Response(null, {status: 400});
	}
	
	const parsedState = decodeState(state, storedState);
	if(!parsedState) {
		return new Response(null, {status: 400});
	}

	cookieStore.delete("github_oauth_state");

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} 
    catch (e) {
		return new Response(null, {status: 400});
	}
	const githubUserResponse = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});

	if(!githubUserResponse) {
		return new Response(null, {status: 400});
	}

    const githubUser = await githubUserResponse.json();
	const githubUserId = githubUser.id;
	const githubUsername = githubUser.login;
	
	const githubUserEmail = await getGithubUserEmail(githubUser, tokens);
	if(!githubUserEmail) {
		return new Response(null, {status: 400});
	}

	const provider = await getUserByOAuthProvider("github", String(githubUserId));

	const {os, browser} = await getDeviceInfo();

	if(provider?.user) {
		await createSessionCookie(provider.userId, os, browser);
		return new Response(null, {
			status: 302,
			headers: {Location: "/"}
		});
	}
	
	let userId = await upsertOAuthUser({
		provider: "github",
		providerUserId: String(githubUserId),
		name: String(githubUsername),
		email: githubUserEmail,
		providerUsername: String(githubUsername),
		profileImage: githubUser.avatar_url,
		bio: githubUser.bio
	});

	const {session} = await validateRequest();
	if(!session) {
		await createSessionCookie(userId, os, browser);
	}
    
	return new Response(null, {
		status: 302,
		headers: {Location: parsedState.redirectTo || "/"}
	});
}