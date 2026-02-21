import { Provider } from "@/lib/types";
import ProviderCard from "./provider-card";
import { AVAILABLE_PROVIDERS } from "@/lib/auth/oauth";

interface ProvidersListProps {
    providers: Provider[];
    canDisconnect: boolean;
}

export default function ProvidersList({providers, canDisconnect}: ProvidersListProps) {
    const providersMap = Object.fromEntries(providers.map(p => [p.provider, p]));

    return(
        <div className="flex flex-col gap-2">
            {AVAILABLE_PROVIDERS.map((provider) => (
                <ProviderCard
					provider={provider}
					connectedProvider={providersMap[provider.key]}
                    canDisconnect={canDisconnect}
                    key={provider.key}
				/>
            ))}
        </div>
    );
}