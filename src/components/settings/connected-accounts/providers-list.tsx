import { OAuthAccount } from "@/lib/types";
import ProviderCard from "./provider-card";
import { AVAILABLE_PROVIDERS } from "@/lib/auth/oauth";

interface ProvidersListProps {
    accounts: OAuthAccount[];
    canDisconnect: boolean;
}

export default function ProvidersList({accounts, canDisconnect}: ProvidersListProps) {
    const accountsMap = Object.fromEntries(accounts.map(a => [a.provider, a]));

    return(
        <div className="flex flex-col gap-2">
            {AVAILABLE_PROVIDERS.map((provider) => (
                <ProviderCard
					provider={provider}
					account={accountsMap[provider.key]}
                    canDisconnect={canDisconnect}
                    key={provider.key}
				/>
            ))}
        </div>
    );
}