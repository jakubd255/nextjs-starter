"use client";

import { Button } from "@/components/ui/button";
import { useFormAction } from "@/lib/hooks/use-form-action";
import updateAlbumAction from "@/actions/albums/update-album";
import { useFileItems } from "@/lib/upload/use-file-items";
import { useFileInput } from "@/lib/upload/use-file-input";
import { FILE_POLICIES } from "@/lib/upload/policy";
import { StoredFile } from "@/lib/upload/manifest";
import FileGallery from "./kit/file-input/file-gallery";

interface Props {
    files: StoredFile[];
}

export function AlbumImagesForm({files}: Props) {
    const {items, setItems, isDirty, reset} = useFileItems(files ?? []);
    const [state, action, pending] = useFormAction(updateAlbumAction, {onSuccess: ({files}) => reset(files)});
    
    const policy = FILE_POLICIES.images;
    const input = useFileInput({value: items, onChange: setItems, policy, disabled: pending});
    
    return(
        <form action={action} className="w-full max-w-250">
            <FileGallery input={input}/>

            {state?.message && <p className="text-sm font-medium text-destructive">{state?.message}</p>}

            <Button disabled={!isDirty || pending}>
                {pending ? "Saving..." : "Save"}
            </Button>
        </form>
    );
}