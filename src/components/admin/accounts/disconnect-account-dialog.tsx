import disconnectOAuthAccountAction from "@/actions/accounts/disconnect-account";
import ActionDialog from "@/components/kit/action-dialog";
import { useDialogControl } from "@/components/kit/dialog-launcher";
import { OAuthAccount } from "@/db/schema/accounts";
import { useFormAction } from "@/lib/hooks/use-form-action";

interface Props {
    account: OAuthAccount;
}

export default function DisconnectAccountDialog({account}: Props) {
    const {close} = useDialogControl();
    const [_, action, pending] = useFormAction(disconnectOAuthAccountAction.bind(null, account.id, false), {onSuccess: close});

    return(
        <ActionDialog
            title="Disconnect account"
            description="This action will delete user's login method. Please confirm that you want to proceed."
            confirmText="Disconnect"
            variant="destructive"
            action={action}
            pending={pending}
        />
    );
}