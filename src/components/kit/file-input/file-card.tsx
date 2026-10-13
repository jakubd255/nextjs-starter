import { FilePolicy } from "@/lib/upload/policy";
import { FileItemRenderProps } from "@/lib/upload/use-file-input";
import { cn } from "@/lib/utils/cn";
import FilePreview from "./file-preview";
import { Badge } from "@/components/ui/badge";
import FileItemActions from "./file-item-actions";

interface Props {
    p: FileItemRenderProps;
    policy: FilePolicy;
    className?: string;
}

export default function FileCard({ p, policy, className }: Props) {
    return(
        <li
            title={p.item.name}
            className={cn(
                "relative overflow-hidden rounded-lg border bg-muted",
                p.deleted && "border-destructive/50",
                className,
            )}
        >
            <FilePreview
                item={p.item}
                policy={policy}
                className={cn("transition", p.deleted && "opacity-40 grayscale")}
            />

            <div className="absolute left-2 top-2 flex gap-1">
                {p.item.kind !== "existing" && <Badge>New</Badge>}
                {p.deleted && <Badge variant="destructive">Will be removed</Badge>}
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-2">
                <FileItemActions p={p} />
            </div>
        </li>
    );
}