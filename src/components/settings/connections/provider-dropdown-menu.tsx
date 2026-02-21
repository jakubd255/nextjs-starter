"use client";

import disconnectProviderAction from "@/actions/auth/disconnect-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Provider } from "@/lib/types";
import { Ellipsis } from "lucide-react";

interface ProviderDropdownMenuProps {
    provider: Provider;
    disabled?: boolean;
}

export default function ProviderDropdownMenu({provider, disabled=false}: ProviderDropdownMenuProps) {
    const handleDisconnect = async () => {
        await disconnectProviderAction(provider.id);
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