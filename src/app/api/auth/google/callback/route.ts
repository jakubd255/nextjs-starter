import { createSessionCookie, validateRequest } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { decodeState } from "@/lib/auth/oauth/state";
import { handleOAuthLoginOrRegister } from "@/lib/auth/oauth/upsert";
import { getGoogleUser } from "@/lib/auth/oauth/google";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const cookieStore = await cookies();
	const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
	const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;

	if(!code || !state || !storedState || !codeVerifier) {
		return new Response(null, {status: 400});
	}

    const parsedState = decodeState(state, storedState);
    if(!parsedState) {
        return new Response(null, {status: 400});
    }

    cookieStore.delete("google_oauth_state");
    cookieStore.delete("google_code_verifier");

    const result = await getGoogleUser(code, codeVerifier);
    if(!result) {
        return new Response(null, {status: 400});
    }

	const {email, name, googleUserId, profileImage} = result;

    const {session} = await validateRequest();

    const userId = await handleOAuthLoginOrRegister({
        provider: "google",
        providerUserId: googleUserId,
        providerUsername: email,
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