import DataTableFilterMulti from "@/components/data-table/data-table-filter-multi";
import DataTableFilterUser from "@/components/data-table/data-table-filter-user";
import { AVAILABLE_PROVIDERS } from "@/lib/auth/oauth";
import { User } from "@/lib/types";
import { BaseTableToolbar } from "../base-table-toolbar";

interface AccountsTableToolbarProps {
    user?: User;
}

export default function AccountsTableToolbar({user}: AccountsTableToolbarProps) {
    return(
        <BaseTableToolbar resetKeys={["userId", "provider", "providerUserId"]}>
            <DataTableFilterUser user={user}/>
            <DataTableFilterMulti 
                accessorKey="provider" 
                label="Provider" 
                data={AVAILABLE_PROVIDERS.map(provider => ({value: provider.key, label: provider.label}))}
            />
        </BaseTableToolbar>
        
    );
}