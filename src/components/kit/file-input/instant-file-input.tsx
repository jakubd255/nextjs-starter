import { Button } from "@/components/ui/button";
import { checkUrlLoads } from "@/lib/upload/items";
import { ManifestItem } from "@/lib/upload/manifest";
import { FilePolicy, validateFiles, validateUrl } from "@/lib/upload/policy";
import { Pencil, Trash2 } from "lucide-react";
import { ReactNode, useState } from "react";
import FileSourceMenu from "./file-source-menu";

interface Props {
    policy: FilePolicy;
    hasFile: boolean;
    onSubmit: (data: FormData) => void;
    manifestName?: string;
    filesName?: string;
    trigger?: ReactNode;
    disabled?: boolean;
    className?: string;
}

export default function InstantFileInput({
    policy,
    hasFile,
    onSubmit,
    manifestName = "manifest",
    filesName = "files",
    trigger,
    disabled,
    className
}: Props) {
    const [error, setError] = useState<string | null>(null);

    const send = (manifest: ManifestItem[], file?: File) => {
        const fd = new FormData();
        fd.set(manifestName, JSON.stringify(manifest));
        if(file) fd.set(filesName, file);
        setError(null);
        onSubmit(fd);
    };

    const onFiles = ([file]: File[]) => {
        if(!file) return;
        const message = validateFiles([file], policy);
        if(message) return setError(message);
        send([{kind: "new"}], file);
    };

    const onUrl = async (url: string): Promise<string | null> => {
        const invalid = validateUrl(url);
        if(invalid) return invalid;
        if(!(await checkUrlLoads(url, policy.media))) return "Could not load a file from this URL";
        send([{kind: "url", url}]);
        return null;
    }

    return(
        <div className={className}>
            <FileSourceMenu
                policy={policy}
                onFiles={onFiles}
                onUrl={onUrl}
                trigger={
                    trigger ?? (
                        <Button type="button" variant="outline" disabled={disabled} className="backdrop-blur-md">
                            <Pencil className="size-4" /> Edit
                        </Button>
                    )
                }
                extraEntries={[
                    {separator:true},
                    {
                        label: "Remove",
                        icon: Trash2,
                        destructive: true,
                        hidden: !hasFile,
                        disabled,
                        onSelect: () => send([]),
                    },
                ]}
            />

            {error && (
                <p role="alert" className="mt-1 text-sm font-medium text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}