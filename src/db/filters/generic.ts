import { and, or, ilike, eq, inArray, asc, desc, sql, AnyColumn, SQL, count } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;

export interface CommonSearchParams {
    page?: string | number;
    pageSize?: string | number;
    search?: string;
    sortField?: string;
    sortOrder?: "asc" | "desc";
}

export interface ParsedCommonParams {
    page: number;
    pageSize: number;
    search: string | undefined;
    sortField: string;
    sortOrder: "asc" | "desc";
}

export function parseBaseParams(params: CommonSearchParams, defaultSortField = "createdAt"): ParsedCommonParams {
    return {
        page: Number(params.page) || 1,
        pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
        search: params.search?.trim() || undefined,
        sortField: params.sortField || defaultSortField,
        sortOrder: params.sortOrder === "desc" ? "desc" : "asc",
    };
}

interface FilterConfig {
    searchColumns?: AnyColumn[];
    exactMatches?: Record<string, AnyColumn>;
    arrayMatches?: Record<string, AnyColumn>;
}

export function buildGenericWhere(filters: Record<string, any>, config: FilterConfig): SQL | undefined {
    const conditions: SQL[] = [];

    if(filters.search && config.searchColumns?.length) {
        conditions.push(
            or(...config.searchColumns.map(col => ilike(col, `%${filters.search}%`)))!
        );
    }

    if(config.exactMatches) {
        for(const [key, column] of Object.entries(config.exactMatches)) {
            if(filters[key] !== undefined && filters[key] !== null && filters[key] !== "") {
                conditions.push(eq(column, filters[key]));
            }
        }
    }

    if(config.arrayMatches) {
        for(const [key, column] of Object.entries(config.arrayMatches)) {
            if(Array.isArray(filters[key]) && filters[key].length > 0) {
                conditions.push(inArray(column, filters[key]));
            }
        }
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
}

export function createOrderBy<T extends Record<string, AnyColumn>>(
    columnMap: T,
    field?: string,
    order: string = "asc",
    defaultField: keyof T & string = "createdAt"
) {
    const targetField = (field && field in columnMap ? field : defaultField) as keyof T;
    const column = columnMap[targetField];

    if(targetField === "name" && column) {
        const lowerName = sql`lower(${column})`;
        return order === "desc" ? desc(lowerName) : asc(lowerName);
    }

    return order === "desc" ? desc(column) : asc(column);
}

export async function countTableRows(db: any, table: any, whereClause: SQL | undefined): Promise<number> {
    const [result] = await db
        .select({count: count()})
        .from(table)
        .where(whereClause);
    return result.count;
}