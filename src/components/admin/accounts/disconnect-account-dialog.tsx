import disconnectOAuthAccountAction from "@/actions/accounts/disconnect-account";
import FormSubmitButton from "@/components/form-submit-button";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ActionResult } from "@/lib/action-result";
import { OAuthAccount } from "@/lib/types";
import { useActionState } from "react";

interface DisconnectAccountDialogProps {
    account: OAuthAccount;
    onDelete?: (result: ActionResult) => void;
}

export default function DisconnectAccountDialog({account, onDelete}: DisconnectAccountDialogProps) {
    const [_, action, pending] = useActionState(async () => {
        const result = await disconnectOAuthAccountAction(account.id, false);
        onDelete?.(result);
        return result;
    }, undefined);

    return(
        <form className="flex flex-col gap-4" action={action}>
            <DialogHeader>
                <DialogTitle>
                    Disconnect account
                </DialogTitle>
                <DialogDescription>
                    This action will delete user's login method. Please confirm that you want to proceed.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton variant="destructive" pending={pending}>
                    Disconnect
                </FormSubmitButton>
            </DialogFooter>
        </form>
    );
}