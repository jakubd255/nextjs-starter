import { createSessionCookie, validateRequest } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { decodeState } from "@/lib/auth/oauth/state";
import { handleOAuthLoginOrRegister } from "@/lib/auth/oauth/upsert";
import { getGitHubUser } from "@/lib/auth/oauth/github";

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

	const result = await getGitHubUser(code);
	if(!result) {
		return new Response(null, {status: 400});
	}

	const {email, name, githubUserId, profileImage} = result;

	const {session} = await validateRequest();

	const userId = await handleOAuthLoginOrRegister({
		provider: "github",
		providerUserId: githubUserId,
		providerUsername: name,
		email: email,
		name: name,
		profileImage,
		session: session
	});
    
    if(!session && userId) {
        await createSessionCookie(userId);
    }
    
	return new Response(null, {
		status: 302,
		headers: {Location: parsedState.redirectTo || "/"}
	});
}