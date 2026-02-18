import { OAuth2Tokens } from "arctic";

export const getGithubUserEmail = async (githubUser: any, tokens: OAuth2Tokens) => {
	if(!githubUser.email) {
		const emailsResponse = await fetch("https://api.github.com/user/emails", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken()}`
			}
		});

		if(!emailsResponse.ok) {
			return null;
		}

		const emails = await emailsResponse.json();
		const primaryEmail = emails.find((email: any) => email.primary && email.verified)?.email;
		if(!primaryEmail) {
			return null;
		}
		return String(primaryEmail);
	}
	else {
		return String(githubUser.email);
	}
}