import { PAGE_SIZE } from "@/lib/constants";
import { OAuthProvider } from "@/lib/types";

export interface AccountsSearchParams {
    page?: number;
    pageSize?: number;
    search?: string;
    userId?: string;
    provider?: OAuthProvider;
    providerUserId?: string;
    sortField?: string;
    sortOrder?: string;
}

export const parseAccountsParams = (params: AccountsSearchParams) => {
    return {
        page: Number(params.page) || 1,
        pageSize: Number(params.pageSize) || PAGE_SIZE,
        search: params.search || undefined,
        userId: params.userId || undefined,
        provider: Array.isArray(params.provider) ? params.provider : params.provider ? [params.provider] : undefined,
        providerUserId: params.providerUserId || undefined,
        sortField: params.sortField as any,
        sortOrder: params.sortOrder as any
    };
}