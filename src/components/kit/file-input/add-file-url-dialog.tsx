"use client";

import { useActionState, useState } from "react";
import { UrlField } from "../form/fields";
import ActionDialog from "../action-dialog";
import { useDialogControl } from "../dialog-launcher";
import { FilePolicy } from "@/lib/upload/policy";

interface Props {
    media: FilePolicy["media"];
    onSubmit: (url: string) => Promise<string | null>;
};

const NOUN = {image: "image", video: "video", file: "file"} as const;

export default function AddFileUrlDialog({media, onSubmit}: Props) {
    const {close} = useDialogControl();
    const [url, setUrl] = useState("");
    const [error, setError] = useState<string | null>(null);

    const noun = NOUN[media];

    const [_, action, pending] = useActionState(async () => {
        const message = await onSubmit(url.trim());
        if(message) return setError(message);
        close();
    }, undefined);

    return(
        <ActionDialog
            title={`Add ${noun} from URL`}
            description={`Paste a direct link to a ${noun} (https only).`}
            action={action}
            pending={pending}
            disabled={!url.trim()}
        >
            <UrlField 
                label={`${noun[0].toUpperCase()}${noun.slice(1)} URL`}
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