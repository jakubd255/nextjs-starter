import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { countUsersAdmin, getUsersAdmin } from "@/db/queries/users";
import { validateRequest } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { forbidden } from "next/navigation";
import { Suspense } from "react";
import UsersTableToolbar from "@/components/admin/users/users-table-toolbar";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { parseUserParams, UserSearchParams } from "./params";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

interface AdminUsersPageProps {
    searchParams: Promise<UserSearchParams>;
};

export default async function AdminUsersPage({searchParams}: AdminUsersPageProps) {
    const {user} = await validateRequest();
    if(!user || !hasPermission(user, "user:read")) {
        forbidden();
    }

    const params = await searchParams;
    const parsedParams = parseUserParams(params);

    const [users, count] = await Promise.all([
        getUsersAdmin(parsedParams), 
        countUsersAdmin(parsedParams)
    ]);

    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                Users
            </h1>
            <Suspense 
                fallback={(<DataTableSkeleton columnCount={10}/>)}
            >
                <UsersTableToolbar/>
                <DataTable columns={columns} data={users}/>
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