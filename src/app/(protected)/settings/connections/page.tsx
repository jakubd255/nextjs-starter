import { Metadata } from "next";
import { APP_TITLE } from "@/lib/constants";
import { requireAuth } from "@/lib/auth/session";
import { getOAuthProvidersByUserId } from "@/db/queries/providers";
import ProvidersList from "@/components/settings/connections/providers-list";
import AccountLinkErrorToast from "@/components/settings/connections/account-link-error-toast";

export const metadata: Metadata = {
    title: `Connected accounts | ${APP_TITLE}`
};

export default async function SettingsConnectionstPage() {
    const {user} = await requireAuth();

    const providers = await getOAuthProvidersByUserId(user.id);
    const canDisconnect = user.hasPassword || providers.length > 1;

    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                Connected accounts
            </h1>
            <ProvidersList providers={providers} canDisconnect={canDisconnect}/>
            <AccountLinkErrorToast/>
        </div>
    );
}