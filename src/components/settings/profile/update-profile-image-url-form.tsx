import updateAvatarAction from "@/actions/users/update-avatar";
import FormSubmitButton from "@/components/form-submit-button";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucia";
import { useActionState, useEffect } from "react";

interface UpdateProfileImageUrlFormProps {
    user: User;
    onUpdate?: (profileImage?: string | null) => void;
}

export default function UpdateProfileImageUrlForm({user, onUpdate}: UpdateProfileImageUrlFormProps) {
    const [state, action, pending] = useActionState(updateAvatarAction, undefined);

    useEffect(() => {
        if(state?.success && onUpdate) onUpdate(state.profileImage);
    }, [state]);

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
                    <Button variant="outline" type="button">
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