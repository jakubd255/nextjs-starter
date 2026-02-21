import { requireAuth } from "@/lib/auth/session";
import { parseProvidersParams, ProvidersSearchParams } from "./params";
import { countOAuthProvidersAdmin, getOAuthProvidersAdmin } from "@/db/queries/providers";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import ProvidersTableToolbar from "@/components/admin/providers/providers-table-toolbar";
import { getUserById } from "@/db/queries/users";

interface AdminOAuthProvidersPageProps {
    searchParams: Promise<ProvidersSearchParams>;
};

export default async function AdminOAuthProvidersPage({searchParams}: AdminOAuthProvidersPageProps) {
    await requireAuth("oauth:read");

    const params = await searchParams;
    const parsedParams = parseProvidersParams(params);

    const [providers, count, user] = await Promise.all([
        getOAuthProvidersAdmin(parsedParams), 
        countOAuthProvidersAdmin(parsedParams),
        params.userId ? getUserById(params.userId) : undefined
    ]);
    
    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                OAuth accounts
            </h1>
            <Suspense fallback={(
                <DataTableSkeleton columnCount={5}/>
            )}>
                <ProvidersTableToolbar user={user}/>
                <DataTable columns={columns} data={providers}/>
                <div className="w-max ml-auto">
                    <PaginationWithLinks 
                        page={params.page} 
                        totalCount={count} 
                        pageSize={params.pageSize} 
                        pageSizeSelectOptions={{pageSizeOptions: [10, 20, 30, 40, 50]}}
                    />
                </div>
            </Suspense>
        </div>
    );
}