import { decodeIdToken, OAuth2Tokens } from "arctic";
import { google } from ".";

interface GoogleUser {
    sub: string;
    name: string;
    picture?: string | null;
    email: string | null;
    email_verified: boolean | null;
}

export const getGoogleUser = async (code: string, codeVerifier: string) => {
    let tokens: OAuth2Tokens;
    try {
        tokens = await google.validateAuthorizationCode(code, codeVerifier);
    } 
    catch (e) {
        return null
    }

    const claims = decodeIdToken(tokens.idToken()) as GoogleUser;

    if(!claims.email || !claims.email_verified) {
        return null;
    }

    return {
        googleUserId: claims.sub,
        name: claims.name,
        profileImage: claims.picture,
        email: claims.email
    }
}