"use client";

import disconnectOAuthAccountAction from "@/actions/accounts/disconnect-account";
import ActionsMenu from "@/components/kit/actions-menu";
import { OAuthAccount } from "@/db/schema/accounts";
import { Ellipsis } from "lucide-react";

interface Props {
    provider: OAuthAccount;
    disabled?: boolean;
}

export default function ProviderDropdownMenu({provider, disabled=false}: Props) {
    const handleDisconnect = async () => {
        await disconnectOAuthAccountAction(provider.id, true);
    }

    return(
        <ActionsMenu 
            trigger={<Ellipsis className="w-4 h-4"/>} 
            triggerVariant="default"
            entries={[
                {
                    label: "Disconnect",
                    destructive: true,
                    disabled: disabled,
                    onSelect: handleDisconnect,
                }
            ]}
        />
    );
}