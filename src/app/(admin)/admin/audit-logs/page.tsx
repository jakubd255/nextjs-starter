import { countAuditLogsAdmin, getAuditLogsAdmin } from "@/db/queries/audit-logs";
import { requireAuth } from "@/lib/auth/session";
import { AuditLogSearchParams, parseAuditLogParams } from "./params";
import { columns } from "./columns";
import AuditLogsTableToolbar from "@/components/admin/audit-logs/audit-logs-table-toolbar";
import AdminTablePageLayout from "@/components/admin/table-page-layout";

interface AdminAuditLogsPageProps {
    searchParams: Promise<AuditLogSearchParams>;
};

export default async function AdminAuditLogsPage({searchParams}: AdminAuditLogsPageProps) {
    await requireAuth("audit:read");

    const params = await searchParams;
    const parsedParams = parseAuditLogParams(params);

    const [logs, count] = await Promise.all([
        getAuditLogsAdmin(parsedParams), 
        countAuditLogsAdmin(parsedParams)
    ]);

    return(
        <AdminTablePageLayout
            title="Audit logs"
            toolbar={<AuditLogsTableToolbar/>}
            columns={columns}
            data={logs}
            totalCount={count}
            page={parsedParams.page}
            pageSize={parsedParams.pageSize}
        />
    );
}