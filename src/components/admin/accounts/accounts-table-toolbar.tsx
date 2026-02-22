import DataTableFilterMulti from "@/components/data-table/data-table-filter-multi";
import DataTableFilterUser from "@/components/data-table/data-table-filter-user";
import DataTableReset from "@/components/data-table/data-table-reset";
import DataTableSearch from "@/components/data-table/data-table-search";
import { Separator } from "@/components/ui/separator";
import { AVAILABLE_PROVIDERS } from "@/lib/auth/oauth";
import { User } from "@/lib/types";

interface AccountsTableToolbarProps {
    user?: User;
}

export default function AccountsTableToolbar({user}: AccountsTableToolbarProps) {
    return(
        <div className="flex gap-2">
            <DataTableSearch/>
            <DataTableFilterUser user={user}/>
            <Separator orientation="vertical"/>
            <DataTableFilterMulti 
                accessorKey="provider" 
                label="Provider" 
                data={AVAILABLE_PROVIDERS.map(provider => ({value: provider.key, label: provider.label}))}
            />
            <DataTableReset keys={["search", "userId", "provider", "providerUserId"]} showSeparator/>
        </div>
    );
}