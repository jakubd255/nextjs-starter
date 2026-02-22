import DialogLauncher from "@/components/dialog-launcher";
import { useSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { hasPermission } from "@/lib/auth/permissions";
import { OAuthAccount } from "@/lib/types";
import { Row } from "@tanstack/react-table";
import { Ellipsis, Trash2 } from "lucide-react";
import { useState } from "react";
import DisconnectAccountDialog from "./disconnect-account-dialog";
import { ActionResult, handleActionResult } from "@/lib/action-result";

interface AccountActionsDropdownProps {
    row: Row<OAuthAccount>;
}

export default function AccountActionsDropdown({row}: AccountActionsDropdownProps) {
    const account = row.original;
    
    const {user: sessionUser} = useSession();

    const [open, setOpen] = useState(false);

    const onDisconnectAccount = (result: ActionResult) => {
        handleActionResult(result, "Successfully disconnected account");
        setOpen(false);
    }

    const permission = hasPermission(sessionUser, "oauth:disconnect");
    if(!permission) return null;

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Ellipsis className="w-4 h-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem variant="destructive" onClick={() => setOpen(true)}>
                    <Trash2 className="w-4 h-4"/>
                    Disconnect
                </DropdownMenuItem>
            </DropdownMenuContent>
            {open ? (
                <DialogLauncher open={open} onOpenChange={setOpen}>
                    <DisconnectAccountDialog 
                        account={account} 
                        onDelete={onDisconnectAccount}
                    />
                </DialogLauncher>
            ) : null}
        </DropdownMenu>
    );
}