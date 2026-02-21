import { PAGE_SIZE } from "@/lib/constants";

export interface ProvidersSearchParams {
    page?: number;
    pageSize?: number;
    search?: string;
    userId?: string;
    provider?: string;
    providerUserId?: string;
    sortField?: string;
    sortOrder?: string;
}

export const parseProvidersParams = (params: ProvidersSearchParams) => {
    return {
        page: Number(params.page) || 1,
        pageSize: Number(params.pageSize) || PAGE_SIZE,
        search: params.search || undefined,
        userId: params.userId || undefined,
        provider: params.provider || undefined,
        providerUserId: params.providerUserId || undefined,
        sortField: params.sortField as any,
        sortOrder: params.sortOrder as any,
    };
}