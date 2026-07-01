import DialogLauncher from "@/components/dialog-launcher";
import { useSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { hasPermission } from "@/lib/auth/permissions";
import { Row } from "@tanstack/react-table";
import { Ellipsis, Trash2 } from "lucide-react";
import { useState } from "react";
import DisconnectAccountDialog from "./disconnect-account-dialog";
import { OAuthAccount } from "@/db/schema/accounts";

interface AccountActionsDropdownProps {
    row: Row<OAuthAccount>;
}

export default function AccountActionsDropdown({row}: AccountActionsDropdownProps) {
    const account = row.original;
    
    const {user} = useSession();

    const [open, setOpen] = useState(false);

    const permission = hasPermission(user, "oauth:disconnect");
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
                        onSuccess={() => setOpen(false)}
                    />
                </DialogLauncher>
            ) : null}
        </DropdownMenu>
    );
}