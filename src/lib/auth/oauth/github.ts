import { OAuth2Tokens } from "arctic";
import { github } from ".";

interface GitHubUser {
	id: string;
	login: string;
	avatar_url?: string | null;
	bio?: string | null;
	email?: string | null;
}

export const getGitHubUser = async (code: string) => {
    let tokens: OAuth2Tokens;
    try {
        tokens = await github.validateAuthorizationCode(code);
    } 
    catch (e) {
        return null;
    }
    const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${tokens.accessToken()}`
        }
    });

    if(!githubUserResponse) {
        return null;
    }

    const githubUser = await githubUserResponse.json() as GitHubUser;
    
    const email = await getGithubUserEmail(githubUser, tokens);
    if(!email) {
        return null;
    }

    return {
        githubUserId: githubUser.id,
        name: githubUser.login,
        profileImage: githubUser.avatar_url,
        email: email
    }
}

const getGithubUserEmail = async (githubUser: GitHubUser, tokens: OAuth2Tokens) => {
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