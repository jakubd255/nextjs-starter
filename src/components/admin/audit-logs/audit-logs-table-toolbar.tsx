import DataTableFilterMulti from "@/components/data-table/data-table-filter-multi";
import { AUDIT_ACTIONS } from "@/db/schema/audit-logs";
import { BaseTableToolbar } from "../base-table-toolbar";

export default function AuditLogsTableToolbar() {
    return (
        <BaseTableToolbar resetKeys={["action"]}>
            <DataTableFilterMulti 
                accessorKey="action" 
                label="Action Type" 
                data={AUDIT_ACTIONS.map(action => ({value: action, label: action}))}
            />
        </BaseTableToolbar>
    );
}