import { Provider } from "@/lib/types";
import Image from "next/image";
import ProviderDropdownMenu from "./provider-dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleCheckBig } from "lucide-react";

interface ProviderCardProps {
	provider: {
        label: string;
        iconLight: string;
        iconDark?: string | null;
        url: string;
        key: string;
    }
	connectedProvider?: Provider;
}

export default function ProviderCard({provider, connectedProvider}: ProviderCardProps) {
    return(
        <div className="flex flex-col gap-2 p-4 rounded-md border max-w-115">
            <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                    <Image
                        src={provider.iconLight}
                        alt={`${provider.label} icon`}
                        className={provider.iconDark ? "dark:hidden h-4 w-4" : "h-4 w-4"}
                        width={16}
                        height={16}
                    />
                    {provider.iconDark && (
                        <Image
                            src={provider.iconDark}
                            alt={`${provider.label} icon`}
                            className="hidden dark:block h-4 w-4"
                            width={16}
                            height={16}
                        />
                    )}
                    <b>
                        {provider.label}
                    </b>
                </div>
                {connectedProvider ? (
                    <ProviderDropdownMenu provider={connectedProvider}/>
                ) : (
                    <Button variant="outline" asChild>
                        <Link href={`${provider.url}?redirect=/settings/connections`}>
                            Connect
                        </Link>
                    </Button>
                )}
            </div>
            {connectedProvider && (
                <div className="flex gap-2 items-center">
                    <CircleCheckBig className="w-4 h-4 text-green-500" />
                    <span>
                        Connected as <b>{connectedProvider.providerUsername}</b>
                    </span>
                </div>
            )}
        </div>
    );
}