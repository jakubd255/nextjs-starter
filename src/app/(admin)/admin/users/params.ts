import { CommonSearchParams, parseBaseParams } from "@/db/filters/generic";
import { Role } from "@/lib/types";

export interface UserSearchParams extends CommonSearchParams {
    role?: Role | Role[];
    verified?: string;
    blocked?: string;
}

export const parseUserParams = (params: UserSearchParams) => ({
    ...parseBaseParams(params),
    role: params.role ? (Array.isArray(params.role) ? params.role : [params.role]) : undefined,
    verified: params.verified === undefined ? undefined : params.verified === "true",
    blocked: params.blocked === undefined ? undefined : params.blocked === "true"
});