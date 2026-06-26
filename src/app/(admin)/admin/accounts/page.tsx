import { requireAuth } from "@/lib/auth/session";
import { columns } from "./columns";
import AccountsTableToolbar from "@/components/admin/accounts/accounts-table-toolbar";
import { getUserById } from "@/db/queries/users";
import { countOAuthAccountsAdmin, getOAuthAccountsAdmin } from "@/db/queries/accounts";
import { AccountSearchParams, parseAccountsParams } from "./params";
import AdminTablePageLayout from "@/components/admin/table-page-layout";

interface AdminOAuthProvidersPageProps {
    searchParams: Promise<AccountSearchParams>;
};

export default async function AdminOAuthAccountsPage({searchParams}: AdminOAuthProvidersPageProps) {
    await requireAuth("oauth:read");

    const params = await searchParams;
    const parsedParams = parseAccountsParams(params);

    const [accounts, count, user] = await Promise.all([
        getOAuthAccountsAdmin(parsedParams), 
        countOAuthAccountsAdmin(parsedParams),
        params.userId ? getUserById(params.userId) : undefined
    ]);

    return(
        <AdminTablePageLayout
            title="OAuth accounts"
            toolbar={<AccountsTableToolbar user={user}/>}
            columns={columns}
            data={accounts}
            totalCount={count}
            page={parsedParams.page}
            pageSize={parsedParams.pageSize}
        />
    );
}