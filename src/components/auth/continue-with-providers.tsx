import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { AVAILABLE_PROVIDERS } from "@/lib/auth/oauth";

export default function ContinueWithProviders() {
    return(
        <div className="flex flex-col gap-3">
            {AVAILABLE_PROVIDERS.map(provider => (
                <Button variant="outline" key={provider.key} asChild>
                    <Link href={provider.url}>
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
                        Continue with {provider.label}
                    </Link>
                </Button>
            ))}
        </div>
    );
}