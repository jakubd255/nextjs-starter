
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGE_SIZE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DataTableSkeletonProps extends React.ComponentProps<"div"> {
  columnCount: number;
  rowCount?: number;
  filterCount?: number;
  cellWidths?: string[];
  withViewOptions?: boolean;
  withPagination?: boolean;
  shrinkZero?: boolean;
}

export function DataTableSkeleton({
    columnCount,
    rowCount = PAGE_SIZE,
    filterCount = 0,
    cellWidths = ["auto"],
    withViewOptions = true,
    withPagination = true,
    shrinkZero = false,
    className,
    ...props
}: DataTableSkeletonProps) {
    const cozyCellWidths = Array.from(
        {length: columnCount},
        (_, index) => cellWidths[index % cellWidths.length] ?? "auto",
    );

    return(
        <div className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)} {...props}>
            <Skeleton className="h-9 w-50 shrink-0"/>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {Array.from({length: 1}).map((_, i) => (
                            <TableRow key={i} className="hover:bg-transparent">
                                {Array.from({length: columnCount}).map((_, j) => (
                                <TableHead
                                    key={j}
                                    style={{
                                        width: cozyCellWidths[j],
                                        minWidth: shrinkZero ? cozyCellWidths[j] : "auto",
                                    }}
                                >
                                    <Skeleton className="h-7.5 w-full"/>
                                </TableHead>
                            ))}
                        </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {Array.from({length: rowCount}).map((_, i) => (
                        <TableRow key={i} className="hover:bg-transparent">
                            {Array.from({length: columnCount}).map((_, j) => (
                                <TableCell
                                    key={j}
                                    style={{
                                        width: cozyCellWidths[j],
                                        minWidth: shrinkZero ? cozyCellWidths[j] : "auto",
                                    }}
                                >
                                    <Skeleton className="h-7.5 w-full"/>
                                </TableCell>
                            ))}
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {withPagination ? (
                <Skeleton className="h-9 w-120 shrink-0 ml-auto"/>
            ) : null}
        </div>
    );
}
