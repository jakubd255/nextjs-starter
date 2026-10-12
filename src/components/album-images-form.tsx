"use client";

import { Button } from "@/components/ui/button";
import MultiImageInput from "@/components/kit/image-input/multi-image-input";
import { useImageItems } from "@/lib/storage/image-items";
import { useFormAction } from "@/lib/hooks/use-form-action";
import updateAlbumAction from "@/actions/albums/update-album";

interface Props {
    images: string[];
}

export function AlbumImagesForm({images}: Props) {
    const {items, setItems, isDirty, reset} = useImageItems(images);
    const [state, action, pending] = useFormAction(updateAlbumAction, {onSuccess: ({images}) => reset(images)});

    return(
        <form action={action} className="w-full max-w-250">
            <MultiImageInput value={items} onChange={setItems} disabled={pending}/>

            {state?.message && <p className="text-sm font-medium text-destructive">{state?.message}</p>}

            <Button disabled={!isDirty || pending}>
                {pending ? "Saving..." : "Save"}
            </Button>
        </form>
    );
}