import { ChevronLeft, ChevronRight, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { FileInput } from "@/lib/upload/use-file-input";
import { FileItem } from "@/lib/upload/items";

interface Props {
    input: FileInput;
    item: FileItem;
    index: number;
    disabled?: boolean;
    className?: string;
}

export default function FileItemActions({input, item, index, disabled, className}: Props) {
    const deleted = item.kind === "existing" && item.deleted;
    const canReorder = !input.single && !deleted;

    return(
        <div className={cn("flex items-center justify-between gap-1", className)}>
            <div className="flex gap-1">
                {canReorder && (
                    <>
                        <Button
                            type="button" variant="secondary" size="icon" className="size-7" 
                            aria-label="Move back"
                            disabled={disabled || index === 0}
                            onClick={() => input.move(index, -1)}
                        >
                            <ChevronLeft />
                        </Button>
                        <Button
                            type="button" variant="secondary" size="icon" className="size-7"
                            aria-label="Move forward"
                            disabled={disabled || index === input.items.length - 1}
                            onClick={() => input.move(index, 1)}
                        >
                            <ChevronRight />
                        </Button>
                    </>
                )}
            </div>
            {deleted ? (
                <Button
                    type="button" variant="secondary" size="sm" className="h-7"
                    aria-label="Undo" disabled={disabled} onClick={() => input.restore(item)}
                >
                    <RotateCcw /> Undo
                </Button>
            ) : (
                <Button
                    type="button" variant="destructive" size="icon" className="size-7"
                    aria-label="Remove" disabled={disabled} onClick={() => input.remove(item)}
                >
                    <Trash2 />
                </Button>
            )}
        </div>
    );
}