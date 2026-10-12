"use client";

import { useActionState, useState } from "react";
import { UrlField } from "../form/fields";
import ActionDialog from "../action-dialog";
import { useDialogControl } from "../dialog-launcher";

interface Props {
    onSubmit: (url: string) => Promise<string | null>;
};

export default function AddImageUrlDialog({onSubmit}: Props) {
    const {close} = useDialogControl();

    const [url, setUrl] = useState("");
    const [error, setError] = useState<string | null>(null);

    const [_, action, pending] = useActionState(async () => {
        const message = await onSubmit(url.trim());
        if(message) return setError(message);
        close();
    }, undefined);

    return(
        <ActionDialog
            title="Add image from URL"
            description="Paste a direct link to an image (https only)."
            action={action}
            pending={pending}
            disabled={!url.trim()}
        >
            <UrlField 
                label="Image URL" 
                name="url"
                onValueChange={value => {
                    setUrl(value);
                    setError(null);
                }}
                errors={error ? [error] : undefined}
            />
        </ActionDialog>
    );
}