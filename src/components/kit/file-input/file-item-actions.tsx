import { ChevronLeft, ChevronRight, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { FileItemRenderProps } from "@/lib/upload/use-file-input";

interface Props {
    p: FileItemRenderProps;
    className?: string;
}

export default function FileItemActions({p, className}: Props) {
    return(
        <div className={cn("flex items-center justify-between gap-1", className)}>
            <div className="flex gap-1">
                {p.reorderable && !p.deleted && (
                    <>
                        <Button
                            type="button" variant="secondary" size="icon" className="size-7"
                            aria-label="Move back" disabled={!p.canMoveBack} onClick={() => p.move(-1)}
                        >
                            <ChevronLeft />
                        </Button>
                        <Button
                            type="button" variant="secondary" size="icon" className="size-7"
                            aria-label="Move forward" disabled={!p.canMoveForward} onClick={() => p.move(1)}
                        >
                            <ChevronRight />
                        </Button>
                    </>
                )}
            </div>

            {p.deleted ? (
                <Button
                    type="button" variant="secondary" size="sm" className="h-7"
                    disabled={p.disabled} onClick={p.restore}
                >
                    <RotateCcw /> Undo
                </Button>
            ) : (
                <Button
                    type="button" variant="destructive" size="icon" className="size-7"
                    aria-label="Remove" disabled={p.disabled} onClick={p.remove}
                >
                    <Trash2 />
                </Button>
            )}
        </div>
    );
}