import { useSession } from "@/components/providers/session-provider";
import { hasPermission } from "@/lib/auth/permissions";
import { Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import DisconnectAccountDialog from "./disconnect-account-dialog";
import { OAuthAccount } from "@/db/schema/accounts";
import ActionsMenu from "@/components/kit/actions-menu";

interface Props {
    row: Row<OAuthAccount>;
}

export default function AccountActionsDropdown({row}: Props) {
    const {user} = useSession();

    return(
        <ActionsMenu entries={[{
            label: "Disconnect", 
            icon: Trash2, 
            destructive: true,
            hidden: !hasPermission(user, "oauth:disconnect"),
            dialog: <DisconnectAccountDialog account={row.original}/>
        }]}/>
    );
}