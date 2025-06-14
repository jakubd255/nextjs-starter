import { countUsers, getUsers } from "@/db/queries/users";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import DataSearch from "@/components/data-search";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { PAGE_SIZE } from "@/lib/constants";

interface AdminUsersPageProps {
    searchParams: Promise<{
        search?: string;
        page?: number;
    }>;
}

export default async function AdminUsersPage({searchParams}: AdminUsersPageProps) {
    const params = await searchParams;
    const search = params.search ?? "";
    const page = Number(params.page ?? 1);

    const users = await getUsers(search, page);
    const count = await countUsers(search);

    return(
        <div className="flex flex-col gap-2">
            <DataSearch search={search}/>
            <DataTable columns={columns} data={users}/>
            <PaginationWithLinks page={page} pageSize={PAGE_SIZE} totalCount={count}/>
        </div>
    );
}