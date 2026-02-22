import { requireAuth } from "@/lib/auth/session";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import AccountsTableToolbar from "@/components/admin/accounts/accounts-table-toolbar";
import { getUserById } from "@/db/queries/users";
import { countOAuthAccountsAdmin, getOAuthAccountsAdmin } from "@/db/queries/accounts";
import { AccountsSearchParams, parseAccountsParams } from "./params";

interface AdminOAuthProvidersPageProps {
    searchParams: Promise<AccountsSearchParams>;
};

export default async function AdminOAuthAccountsPage({searchParams}: AdminOAuthProvidersPageProps) {
    await requireAuth("oauth:read");

    const params = await searchParams;
    const parsedParams = parseAccountsParams(params);

    const [providers, count, user] = await Promise.all([
        getOAuthAccountsAdmin(parsedParams), 
        countOAuthAccountsAdmin(parsedParams),
        params.userId ? getUserById(params.userId) : undefined
    ]);
    
    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                OAuth accounts
            </h1>
            <Suspense fallback={(
                <DataTableSkeleton columnCount={6}/>
            )}>
                <AccountsTableToolbar user={user}/>
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