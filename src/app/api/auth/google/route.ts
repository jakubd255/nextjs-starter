import { google } from "@/lib/auth/oauth";
import { encodeState } from "@/lib/auth/oauth/state";
import { generateState, generateCodeVerifier } from "arctic";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const encodedState = encodeState(request, state);
	const url = google.createAuthorizationURL(encodedState, codeVerifier, ["openid", "email", "profile"]);

	const cookieStore = await cookies();
	cookieStore.set("google_oauth_state", state, {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 10,
		sameSite: "lax"
	});
	cookieStore.set("google_code_verifier", codeVerifier, {
		path: "/",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 10,
		sameSite: "lax"
	});

	return new Response(null, {
		status: 302,
		headers: {Location: url.toString()}
	});
}