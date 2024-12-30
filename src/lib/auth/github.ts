import { GitHub, GitHubTokens } from "arctic";

export const github = new GitHub(process.env.GITHUB_ID!, process.env.GITHUB_SECRET!);

export interface GitHubEmail {
	email: string;
	primary: boolean;
	verified: boolean;
	visibility: string | null;
}

export interface GitHubUser {
	login: string;
	id: number;
	avatar_url: string;
	name: string;
	email: string | null;
}

const getPrimaryEmail = (emails: GitHubEmail[]): string | null => {
	const primaryEmail = emails.find((email) => email.primary);
	return primaryEmail ? primaryEmail.email : null;
}

export const getUserEmail = async (tokens: GitHubTokens) => {
    const githubUserEmailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {Authorization: `Bearer ${tokens.accessToken}`}
    });
    const githubUserEmails = await githubUserEmailResponse.json();

    const primaryEmail = getPrimaryEmail(githubUserEmails);
    if(!primaryEmail) {
        throw Error("Something went wrong")
    }

    return primaryEmail;
}

export const getGithubUser = async (tokens: GitHubTokens) => {
    const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {Authorization: `Bearer ${tokens.accessToken}`}
    });
    return await githubUserResponse.json() as GitHubUser;
}