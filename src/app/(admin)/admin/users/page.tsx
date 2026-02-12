import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { countUsersAdmin, getUsersAdmin } from "@/db/queries/users";
import { validateRequest } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { forbidden } from "next/navigation";
import { Suspense } from "react";
import UsersTableToolbar from "@/components/admin/users-table-toolbar";
import { parseUserParams, UserSearchParams } from "@/lib/params/users";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";

interface AdminUsersPageProps {
    searchParams: Promise<UserSearchParams>;
};

export default async function AdminUsersPage({searchParams}: AdminUsersPageProps) {
    const {user} = await validateRequest();
    if(!user || !hasPermission(user, "user:read")) {
        forbidden();
    }

    const params = await searchParams;
    const [users, count] = await Promise.all([
        getUsersAdmin(parseUserParams(params)),
        countUsersAdmin(parseUserParams(params))
    ]);

    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                Users
            </h1>
            <Suspense>
                <UsersTableToolbar/>
                <DataTable columns={columns} data={users}/>
                <PaginationWithLinks page={params.page} totalCount={count}/>
            </Suspense>
        </div>
    );
}