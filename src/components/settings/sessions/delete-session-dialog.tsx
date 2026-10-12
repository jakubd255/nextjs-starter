"use client";

import deleteSessionAction from "@/actions/sessions/delete-session";
import ActionDialog from "@/components/kit/action-dialog";
import { useDialogControl } from "@/components/kit/dialog-launcher";
import { useFormAction } from "@/lib/hooks/use-form-action";

interface Props {
    id: string;
}

export default function DeleteSessionDialog({id}: Props) {
    const {close} = useDialogControl();
    const [_, action] = useFormAction(deleteSessionAction.bind(null, id), {onStart: close});

    return(
        <ActionDialog
            title="Delete session"
            description="This is the session for the device you are using now. Once deleted you will be logged out."
            confirmText="Delete"
            variant="destructive"
            action={action}
        />
    );
}