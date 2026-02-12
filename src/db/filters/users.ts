import { Role } from "@/lib/types";
import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { users } from "../schema";

export interface UserFilters {
    search?: string;
    role?: Role[];
    verified?: boolean;
    blocked?: boolean;
}

export interface GetUsersParams {
    page?: number;
    search?: string;
    role?: Role[];
    verified?: boolean;
    blocked?: boolean;
    sortField?: string;
    sortOrder?: string;
};

export const buildUserSearchWhere = (filters: UserFilters) => {
    const conditions = [];

    if(filters.search) {
        conditions.push(
            or(
                ilike(users.id, `%${filters.search}%`),
                ilike(users.name, `%${filters.search}%`),
                ilike(users.role, `%${filters.search}%`),
                ilike(users.bio, `%${filters.search}%`),
                ilike(users.email, `%${filters.search}%`),
                ilike(users.pendingEmail, `%${filters.search}%`)
            )
        );
    }

    if(filters.role && filters.role.length > 0) {
        conditions.push(inArray(users.role, filters.role));
    }
    if(typeof filters.verified === "boolean") {
        conditions.push(eq(users.verified, filters.verified));
    }
    if(typeof filters.blocked === "boolean") {
        conditions.push(eq(users.blocked, filters.blocked));
    }
    if(conditions.length === 0) return undefined;

    return and(...conditions);
}

export const getOrderBy = (field: string = "createdAt", order: string = "asc") => {
    const columnMap = {
        createdAt: users.createdAt,
        name: users.name,
        email: users.email,
        role: users.role,
        id: users.id
    };

    if(field === "name") {
        const lowerName = sql`lower(${users.name})`;
        return order === "asc" ? asc(lowerName) : desc(lowerName);
    }

    const column = columnMap[field as keyof typeof columnMap];
    return order === "asc" ? asc(column) : desc(column);
}