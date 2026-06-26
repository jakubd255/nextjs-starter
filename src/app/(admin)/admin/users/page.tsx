import { columns } from "./columns";
import { countUsersAdmin, getUsersAdmin } from "@/db/queries/users";
import { requireAuth } from "@/lib/auth/session";
import UsersTableToolbar from "@/components/admin/users/users-table-toolbar";
import { parseUserParams, UserSearchParams } from "./params";
import AdminTablePageLayout from "@/components/admin/table-page-layout";

interface AdminUsersPageProps {
    searchParams: Promise<UserSearchParams>;
};

export default async function AdminUsersPage({searchParams}: AdminUsersPageProps) {
    await requireAuth("user:read");

    const params = await searchParams;
    const parsedParams = parseUserParams(params);

    const [users, count] = await Promise.all([
        getUsersAdmin(parsedParams), 
        countUsersAdmin(parsedParams)
    ]);

    return(
        <AdminTablePageLayout
            title="Users"
            toolbar={<UsersTableToolbar/>}
            columns={columns}
            data={users}
            totalCount={count}
            page={parsedParams.page}
            pageSize={parsedParams.pageSize}
        />
    );
}