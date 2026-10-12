import { checkImageLoads, ManifestEntry } from "@/lib/storage/image-items";
import { IMAGE_RULES, validateImage, validateImageUrl } from "@/lib/storage/validate";
import { useRef, useState } from "react";
import DialogLauncher from "../dialog-launcher";
import AddImageUrlDialog from "./add-image-url-dialog";
import { Link2, Pencil, Trash2, Upload } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Props {
    hasImage: boolean;
    onSubmit: (data: FormData) => void;
    manifestName?: string;
    filesName?: string;
    accept?: readonly string[];
    disabled?: boolean;
    className?: string;
}

export default function InstantImageInput({
    hasImage, 
    onSubmit, 
    manifestName = "manifest", 
    filesName = "files", 
    accept = IMAGE_RULES.types, 
    disabled, 
    className
}: Props) {
    const pickerRef = useRef<HTMLInputElement>(null);
    const [urlOpen, setUrlOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const send = (manifest: ManifestEntry[], file?: File) => {
        const fd = new FormData();
        fd.set(manifestName, JSON.stringify(manifest));
        if(file) fd.set(filesName, file);
        setError(null);
        onSubmit(fd);
    }

    const pickFile = (file?: File) => {
        if (!file) return;
        const message = validateImage(file);
        if (message) return setError(`${file.name}: ${message}`);
        send([{kind: "new"}], file);
    }

    const addUrl = async (url: string): Promise<string | null> => {
        const invalid = validateImageUrl(url);
        if(invalid) return invalid;
        if(!(await checkImageLoads(url))) return "Could not load an image from this URL";
        send([{kind: "url", url}]);
        return null;
    }

    return (
        <div className={className}>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" disabled={disabled} className="backdrop-blur-md">
                        <Pencil className="size-4" /> Edit
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onSelect={() => pickerRef.current?.click()}>
                        <Upload/> Upload image
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setUrlOpen(true)}>
                        <Link2/> Set image from URL
                    </DropdownMenuItem>
                    {hasImage && (
                        <DropdownMenuItem onSelect={() => send([])}>
                            <Trash2/> Remove image
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <input
                ref={pickerRef}
                type="file"
                hidden
                accept={accept.join(",")}
                onChange={(e) => {
                    pickFile(e.target.files?.[0]);
                    e.target.value = "";
                }}
            />
            <DialogLauncher open={urlOpen} onOpenChange={setUrlOpen}>
                <AddImageUrlDialog onSubmit={addUrl} />
            </DialogLauncher>
            {error && (
                <p role="alert" className="mt-1 text-sm font-medium text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}