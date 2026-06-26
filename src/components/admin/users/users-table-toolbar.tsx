import DataTableFilterMulti from "@/components/data-table/data-table-filter-multi";
import DataTableFilterSingle from "@/components/data-table/data-table-filter-single";
import { ROLES } from "@/lib/auth/permissions";
import { BaseTableToolbar } from "../base-table-toolbar";

export default function UsersTableToolbar() {
    return(
        <BaseTableToolbar resetKeys={["role", "verified", "blocked"]}>
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
        </BaseTableToolbar>
    );
}