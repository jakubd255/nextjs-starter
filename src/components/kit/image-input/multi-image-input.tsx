"use client";

import { useRef, useState } from "react";
import { ImagePlus, Link2, Upload } from "lucide-react";
import { IMAGE_RULES, validateImage, validateImageUrl } from "@/lib/storage/validate";
import ImageCard from "./image-card";
import { buildManifest, checkImageLoads, createNewItem, createUrlItem, ImageItem, isActive, revokePreview } from "@/lib/storage/image-items";
import { cn } from "@/lib/utils/cn";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddImageUrlDialog from "./add-image-url-dialog";
import DialogLauncher from "../dialog-launcher";

interface Props {
    value: ImageItem[];
    onChange: (items: ImageItem[]) => void;
    manifestName?: string;
    filesName?: string;
    maxFiles?: number;
    accept?: readonly string[];
    disabled?: boolean;
    className?: string;
    tileClassName?: string;
    listClassName?: string;
};

const DEFAULT_TILE = "size-24 lg:size-48 sm:size-32";

export default function MultiImageInput({
    value, 
    onChange,
    manifestName = "manifest", 
    filesName = "files", 
    maxFiles = IMAGE_RULES.maxFiles, 
    accept = IMAGE_RULES.types, 
    disabled, 
    className,
    tileClassName = DEFAULT_TILE,
    listClassName
}: Props) {
    const pickerRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [urlDialogOpen, setUrlDialogOpen] = useState(false);

    const activeCount = value.filter(isActive).length;
    const canAdd = !disabled && activeCount < maxFiles;

    const syncFiles = (input: HTMLInputElement | null) => {
        if(!input) return;
        const dt = new DataTransfer();
        value.forEach(i => i.kind === "new" && dt.items.add(i.file));
        input.files = dt.files;
    };

    const addFiles = (list: FileList | null) => {
        if(!list) return;
        const incoming = Array.from(list);

        if(activeCount + incoming.length > maxFiles) {
            return setError(`You can add up to ${maxFiles} images`);
        }
        for(const file of incoming) {
            const message = validateImage(file);
            if (message) return setError(`${file.name}: ${message}`);
        }

        setError(null);
        onChange([...value, ...incoming.map(createNewItem)]);
    };

    const addUrl = async (url: string): Promise<string | null> => {
        const invalid = validateImageUrl(url);
        if(invalid) return invalid;

        if(activeCount >= maxFiles) return `You can add up to ${maxFiles} images`;

        if(value.some((i) => isActive(i) && i.kind !== "new" && i.url === url)) {
            return "This image is already on the list";
        }

        if(!(await checkImageLoads(url))) return "Could not load an image from this URL";

        onChange([...value, createUrlItem(url)]);
        setError(null);
        return null;
    };

    const remove = (item: ImageItem) => {
        if(item.kind === "existing") {
            onChange(value.map((i) => (i.id === item.id ? {...i, deleted: true} : i)));
        } 
        else {
            revokePreview(item);
            onChange(value.filter((i) => i.id !== item.id));
        }
        setError(null);
    };

    const restore = (item: ImageItem) => {
        onChange(value.map((i) => (i.id === item.id && i.kind === "existing" ? {...i, deleted: false} : i)));
    }

    const move = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if(target < 0 || target >= value.length) return;
        const copy = [...value];
        [copy[index], copy[target]] = [copy[target], copy[index]];
        onChange(copy);
    }

    return(
        <div className={cn("space-y-2", className)}>
            <ul className={cn("flex flex-wrap gap-3", listClassName)}>
                {value.map((item, index) => (
                    <ImageCard
                        key={item.id}
                        item={item}
                        index={index}
                        total={value.length}
                        disabled={disabled}
                        onMove={move}
                        onRemove={remove}
                        onRestore={restore}
                        className={className}
                    />
                ))}
                {canAdd && (
                    <li className={tileClassName}>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <ImagePlus className="size-6" />
                                    Add image
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onSelect={() => pickerRef.current?.click()}>
                                    <Upload/> Upload from device
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setUrlDialogOpen(true)}>
                                    <Link2/> Add from URL
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </li>
                )}
            </ul>
            <input
                ref={pickerRef}
                type="file"
                multiple
                hidden
                accept={accept.join(",")}
                onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                }}
            />
            <input type="hidden" name={manifestName} value={JSON.stringify(buildManifest(value))}/>
            <input ref={syncFiles} type="file" name={filesName} multiple hidden tabIndex={-1} aria-hidden/>
            <DialogLauncher open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
                <AddImageUrlDialog onSubmit={addUrl}/>
            </DialogLauncher>
            <p className="text-xs text-muted-foreground">
                {activeCount}/{maxFiles} images
            </p>
            {error && (
                <p role="alert" className="text-sm font-medium text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}