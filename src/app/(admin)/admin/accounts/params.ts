import { CommonSearchParams, parseBaseParams } from "@/db/filters/generic";
import { OAuthProvider } from "@/lib/types";

export interface AccountSearchParams extends CommonSearchParams {
    userId?: string;
    provider?: OAuthProvider | OAuthProvider[];
    providerUserId?: string;
}

export const parseAccountsParams = (params: AccountSearchParams) => ({
    ...parseBaseParams(params),
    userId: params.userId || undefined,
    providerUserId: params.providerUserId || undefined,
    provider: params.provider ? (Array.isArray(params.provider) ? params.provider : [params.provider]) : undefined
});