"use client";

import { ChevronLeft, ChevronRight, RotateCcw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { ImageItem } from "@/lib/storage/image-items";

interface Props {
    item: ImageItem;
    index: number;
    total: number;
    disabled?: boolean;
    onMove: (index: number, direction: -1 | 1) => void;
    onRemove: (item: ImageItem) => void;
    onRestore: (item: ImageItem) => void;
    className?: string;
};

export default function ImageCard({
    item, 
    index, 
    total, 
    disabled, 
    onMove, 
    onRemove, 
    onRestore, 
    className
}: Props) {
    const markedForDeletion = item.kind === "existing" && item.deleted;

    return(
        <li className={cn(
            "size-48 group relative aspect-square overflow-hidden rounded-lg border bg-muted",
            markedForDeletion && "border-destructive/50", className
        )}>
            <img
                src={item.preview}
                alt=""
                referrerPolicy="no-referrer"
                className={cn(
                    "size-full object-cover transition",
                    markedForDeletion && "opacity-40 grayscale"
                )}
            />
            <div className="absolute left-2 top-2 flex gap-1">
                {item.kind !== "existing" && <Badge>New</Badge>}
                {markedForDeletion && <Badge variant="destructive">Will be removed</Badge>}
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-linear-to-t from-black/60 to-transparent p-2">
                <div className="flex gap-1">
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="size-7"
                        aria-label="Move left"
                        disabled={disabled || markedForDeletion || index === 0}
                        onClick={() => onMove(index, -1)}
                    >
                        <ChevronLeft/>
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="size-7"
                        aria-label="Move right"
                        disabled={disabled || markedForDeletion || index === total - 1}
                        onClick={() => onMove(index, 1)}
                    >
                        <ChevronRight/>
                    </Button>
                </div>
                {markedForDeletion ? (
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-7"
                        disabled={disabled}
                        onClick={() => onRestore(item)}
                    >
                        <RotateCcw/> Undo
                    </Button>
                ) : (
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="size-7"
                        aria-label="Remove image"
                        disabled={disabled}
                        onClick={() => onRemove(item)}
                    >
                        <Trash2/>
                    </Button>
                )}
            </div>
        </li>
    );
}