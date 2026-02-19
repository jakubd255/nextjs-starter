import { getUserByOAuthProvider } from "@/db/queries/providers";
import { createSessionCookie, validateRequest } from "@/lib/auth";
import { google } from "@/lib/auth/oauth";
import { getDeviceInfo } from "@/lib/auth/device-info";
import { decodeIdToken, OAuth2Tokens } from "arctic";
import { cookies } from "next/headers";
import { upsertOAuthUser } from "@/lib/auth/oauth/upsert-user";
import { decodeState } from "@/lib/auth/oauth/state";

interface GoogleUser {
    sub: string;
    name: string;
    picture?: string | null;
    email: string | null;
    email_verified: boolean | null;
}

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

	let tokens: OAuth2Tokens;
    try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} 
    catch (e) {
		return new Response(null, {status: 400});
	}

    const claims = decodeIdToken(tokens.idToken()) as GoogleUser;
	const googleUserId = claims.sub;
	const username = claims.name;
    const picture = claims.picture;
    const email = claims.email;

    if(!email || !claims.email_verified) {
        return new Response(null, {status: 400});
    }

    const provider = await getUserByOAuthProvider("google", String(googleUserId));

    const {os, browser} = await getDeviceInfo();

    const {session} = await validateRequest();

    if(provider?.user) {
        if(session && session.userId !== provider.userId) {
            cookieStore.set("oauth_error", "account_conflict", {path: "/", maxAge: 10, httpOnly: false});
            return new Response(null, {
                status: 302,
                headers: {Location: parsedState.redirectTo || "/"}
            });
        }
        
        await createSessionCookie(provider.userId, os, browser);
        return new Response(null, {
            status: 302,
            headers: {Location: parsedState.redirectTo || "/"}
        });
    }

    const userId = await upsertOAuthUser({
        provider: "google",
        providerUserId: googleUserId,
        name: username,
        email,
        providerUsername: email,
        profileImage: picture
    });

    if(!userId) {
        console.log("This user is taken");
        return new Response(null, {
            status: 302,
            headers: {Location: parsedState.redirectTo || "/"}
        });
    }
    
    if(!session) {
        await createSessionCookie(userId, os, browser);
    }

    return new Response(null, {
        status: 302,
        headers: {Location: parsedState.redirectTo || "/"}
    });
}