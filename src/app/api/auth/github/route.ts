import { github } from "@/lib/auth/oauth";
import { encodeState } from "@/lib/auth/oauth/state";
import { generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
	const state = generateState();
	const encodedState = encodeState(request, state);
	const url = github.createAuthorizationURL(encodedState, ["read:user", "user:email"]);

	const cookieStore = await cookies();
	cookieStore.set("github_oauth_state", state, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	});

	return new Response(null, {
		status: 302,
		headers: {Location: url.toString()}
	});
}