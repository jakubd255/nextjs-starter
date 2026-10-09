"use client";

import updateAvatarAction from "@/actions/users/update-avatar";
import ActionDialog from "@/components/kit/action-dialog";
import { useDialogControl } from "@/components/kit/dialog-launcher";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/db/schema/users";
import { useFormAction } from "@/lib/hooks/use-form-action";

interface Props {
    user: UserProfile;
}

export default function UpdateProfileImageUrlForm({user}: Props) {
    const {close} = useDialogControl();
    const [_, action, pending] = useFormAction(updateAvatarAction, {onSuccess: close});

    return(
        <ActionDialog
            title="Set image from URL"
            action={action}
            pending={pending}
        >
            <div>
                <Label htmlFor="url">
                    URL
                </Label>
                <Input type="url" name="url" id="url"/>
            </div>
            <input type="hidden" name="id" defaultValue={user.id} hidden/>
        </ActionDialog>
    );
}