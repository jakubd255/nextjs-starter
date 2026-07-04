import disconnectOAuthAccountAction from "@/actions/accounts/disconnect-account";
import FormSubmitButton from "@/components/form-submit-button";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OAuthAccount } from "@/db/schema/accounts";
import { useFormAction } from "@/lib/hooks/use-form-action";

interface DisconnectAccountDialogProps {
    account: OAuthAccount;
    onSuccess?: () => void;
}

export default function DisconnectAccountDialog({account, onSuccess}: DisconnectAccountDialogProps) {
    const [_, action, pending] = useFormAction(() => disconnectOAuthAccountAction(account.id, false), {onSuccess});

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