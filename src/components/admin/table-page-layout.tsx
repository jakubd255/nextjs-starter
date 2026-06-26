import { ColumnDef } from "@tanstack/react-table";
import { ReactNode, Suspense } from "react";
import { DataTableSkeleton } from "../data-table/data-table-skeleton";
import { DataTable } from "../data-table/data-table";
import { PaginationWithLinks } from "../ui/pagination-with-links";

interface TablePageLayoutProps<TData, TValue> {
    title: string;
    toolbar: ReactNode;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export default function AdminTablePageLayout<TData, TValue>({title, toolbar, columns, data, totalCount, page, pageSize}: TablePageLayoutProps<TData, TValue>) {
    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                {title}
            </h1>
            <Suspense fallback={
                <DataTableSkeleton columnCount={columns.length}/>
            }>
                {toolbar}
                <DataTable columns={columns} data={data}/>
                <div className="w-max ml-auto">
                    <PaginationWithLinks 
                        page={page} 
                        totalCount={totalCount} 
                        pageSize={pageSize} 
                        pageSizeSelectOptions={{pageSizeOptions: [10, 20, 30, 40, 50]}}
                    />
                </div>
            </Suspense>
        </div>
    );
}