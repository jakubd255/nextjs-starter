import DataTableFilterMulti from "@/components/data-table/data-table-filter-multi";
import DataTableFilterSingle from "@/components/data-table/data-table-filter-single";
import DataTableReset from "@/components/data-table/data-table-reset";
import DataTableSearch from "@/components/data-table/data-table-search";
import { Separator } from "@/components/ui/separator";
import { ROLES } from "@/lib/auth/permissions";

export default function UsersTableToolbar() {
    return(
        <div className="flex gap-2">
            <DataTableSearch/>
            <Separator orientation="vertical"/>
            <DataTableFilterMulti 
                accessorKey="role" 
                label="Role" 
                data={ROLES.map(role => ({value: role, label: role}))}
            />
            <DataTableFilterSingle 
                accessorKey="verified" 
                label="Verified" 
                data={[
                    {value: "true", label: "Verified"},
                    {value: "false", label: "Unverified"},
                ]}
            />
            <DataTableFilterSingle 
                accessorKey="blocked" 
                label="Blocked" 
                data={[
                    {value: "true", label: "Blocked"},
                    {value: "false", label: "Active"},
                ]}
            />
            <DataTableReset keys={["search", "role", "verified", "blocked"]} showSeparator/>
        </div>
    );
}