"use client";

import disconnectOAuthAccountAction from "@/actions/auth/disconnect-account";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OAuthAccount } from "@/lib/types";
import { Ellipsis } from "lucide-react";

interface ProviderDropdownMenuProps {
    provider: OAuthAccount;
    disabled?: boolean;
}

export default function ProviderDropdownMenu({provider, disabled=false}: ProviderDropdownMenuProps) {
    const handleDisconnect = async () => {
        await disconnectOAuthAccountAction(provider.id);
    }

    return(
        <DropdownMenu>
            <DropdownMenuTrigger disabled={disabled} asChild>
                <Button variant="ghost" size="icon">
                    <Ellipsis className="w-4 h-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem 
                        variant="destructive" 
                        disabled={disabled} 
                        onClick={handleDisconnect}
                    >
                        Disconnect
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}