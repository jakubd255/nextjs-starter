"use client";

import updateAvatarAction from "@/actions/users/update-avatar";
import FormSubmitButton from "@/components/form-submit-button";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/db/schema/users";
import { useActionState } from "react";

interface UpdateProfileImageUrlFormProps {
    user: UserProfile;
    onSuccess: () => void;
}

export default function UpdateProfileImageUrlForm({user, onSuccess}: UpdateProfileImageUrlFormProps) {
    const [_, action, pending] = useActionState(async (_: unknown, data: FormData) => {
        const result = await updateAvatarAction(undefined, data);
        if(result.success) onSuccess();
    }, undefined);

    return(
        <form className="flex flex-col gap-4" action={action}>
            <DialogHeader>
                <DialogTitle>
                    Set image from URL
                </DialogTitle>
            </DialogHeader>
            <div>
                <Label htmlFor="url">
                    URL
                </Label>
                <Input type="url" name="url" id="url"/>
            </div>
            <input type="hidden" name="id" defaultValue={user.id} hidden/>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Close
                    </Button>
                </DialogClose>
                <FormSubmitButton pending={pending}>
                    Confirm
                </FormSubmitButton>
            </DialogFooter>
        </form>
    );
}