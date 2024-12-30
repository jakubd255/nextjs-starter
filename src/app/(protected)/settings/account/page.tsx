import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import UpdateProfileSection from "@/components/update-profile-section";
import DeleteAccountDialogForm from "@/components/forms/delete-account-dialog-form";
import EmailSection from "@/components/email-section";
import { validateRequest } from "@/lib/auth/lucia";
import { AccountSettingsProvider } from "@/components/providers/account-settins-provider";
import PasswordSection from "@/components/password-section";
import ConnectedAccountsSection from "@/components/connected-accounts-section";
import { getEmails } from "@/lib/db/email";
import { getAccounts } from "@/lib/db/account";

export const metadata: Metadata = {
    title: "Account settings | NextJS App",
};

export default async function AccountSettingsPage() {
    const {emails, accounts, user} = await getData();

    return(
        <AccountSettingsProvider value={{emails, accounts, hasPassword: user.hasPassword}}>
            <div className="flex flex-col gap-8 pb-2 max-w-[600px] w-full">
                <h1 className="text-center">
                    Account settings
                </h1>
                <UpdateProfileSection/>
                <Separator/>
                <EmailSection/>
                <Separator/>
                <PasswordSection/>
                <Separator/>
                <ConnectedAccountsSection/>
                <Separator/>
                <DeleteAccountDialogForm/>
            </div>
        </AccountSettingsProvider>
    );
}

const getData = async () => {
    const {user} = await validateRequest();
    if(!user) {
        throw Error("Forbidden");
    }
    const emails = await getEmails(user.id);
    const accounts = await getAccounts(user.id);

    return {user, emails, accounts};
}