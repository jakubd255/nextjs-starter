import DataTableSearch from "../data-table/data-table-search";
import DataTableReset from "../data-table/data-table-reset";
import DataTableFilterMulti from "../data-table/data-table-filter-multi";
import DataTableFilterSingle from "../data-table/data-table-filter-single";
import { Separator } from "../ui/separator";

export default function UsersTableToolbar() {
    return(
        <div className="flex gap-2">
            <DataTableSearch/>
            <Separator orientation="vertical"/>
            <DataTableFilterMulti 
                accessorKey="role" 
                label="Role" 
                data={[
                    {value: "ADMIN", label: "ADMIN"},
                    {value: "MODERATOR", label: "MODERATOR"},
                    {value: "USER", label: "USER"}
                ]}
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