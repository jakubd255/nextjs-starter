import { Metadata } from "next";
import { APP_TITLE } from "@/lib/constants";
import { requireAuth } from "@/lib/auth/session";
import ProvidersList from "@/components/settings/connected-accounts/providers-list";
import AccountLinkErrorToast from "@/components/settings/connected-accounts/account-link-error-toast";
import { getOAuthAccountsByUserId } from "@/db/queries/accounts";

export const metadata: Metadata = {
    title: `Connected accounts | ${APP_TITLE}`
};

export default async function SettingsConnectionstPage() {
    const {user} = await requireAuth();

    const accounts = await getOAuthAccountsByUserId(user.id);
    const canDisconnect = user.hasPassword || accounts.length > 1;

    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                Connected accounts
            </h1>
            <ProvidersList accounts={accounts} canDisconnect={canDisconnect}/>
            <AccountLinkErrorToast/>
        </div>
    );
}