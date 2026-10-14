import { cn } from "@/lib/utils/cn";
import FilePreview from "./file-preview";
import { Badge } from "@/components/ui/badge";
import FileItemActions from "./file-item-actions";
import { FileInput } from "@/lib/upload/use-file-input";
import { FileItem } from "@/lib/upload/file-items";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Props {
    input: FileInput;
    item: FileItem;
    index: number;
    className?: string;
    disabled?: boolean;
}

export default function FileCard({input, item, index, className, disabled}: Props) {
    const deleted = item.kind === "existing" && item.deleted;

    return(
        <li
            title={item.name}
            className={cn(
                "relative overflow-hidden rounded-lg border bg-muted",
                deleted && "border-destructive/50",
                className
            )}
        >
            <FilePreview
                item={item}
                policy={input.policy}
                className={cn("transition", deleted && "opacity-40 grayscale")}
            />
            <div className="absolute left-2 top-2 flex gap-1">
                {item.kind !== "existing" && <Badge>New</Badge>}
                {deleted && <Badge variant="destructive">Will be removed</Badge>}
            </div>
            {item.kind === "direct" && item.status !== "done" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 p-3 text-center text-xs">
                    {item.status === "uploading" ? (
                        <>
                            <Progress value={item.progress} className="h-1.5" />
                            <span>{item.progress}%</span>
                        </>
                    ) : (
                        <>
                            <span className="line-clamp-2 text-destructive">{item.error}</span>
                            <Button type="button" size="sm" variant="secondary" onClick={() => input.retry(item)}>
                                Retry
                            </Button>
                        </>
                    )}
                </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-2">
                <FileItemActions input={input} item={item} index={index} disabled={disabled}/>
            </div>
        </li>
    );
}