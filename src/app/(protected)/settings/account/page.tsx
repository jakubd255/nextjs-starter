import DeleteAccountSection from "@/components/delete-account-section";
import EmailSection from "@/components/email-section";
import PasswordSection from "@/components/password-section";
import { AccountSettingsProvider } from "@/components/providers/account-settins-provider";
import { Separator } from "@/components/ui/separator";
import UpdateProfileSection from "@/components/update-profile-section";
import { validateRequest } from "@/lib/auth";
import { findEmailsByUserId } from "@/lib/db/queries/emails";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Account settings | NextJS App",
};

export default async function AccountSettingsPage() {
    const {emails} = await getData();

    return(
        <AccountSettingsProvider value={{emails}}>
            <div className="flex flex-col gap-8 pb-10 max-w-[400px] w-full">
                <h1 className="text-center">
                    Account settings
                </h1>
                <UpdateProfileSection/>
                <Separator/>
                <EmailSection/>
                <Separator/>
                <PasswordSection/>
                <Separator/>
                <DeleteAccountSection/>
            </div>
        </AccountSettingsProvider>
    );
}

const getData = async () => {
    const {user} = await validateRequest();
    if(!user) {
        throw Error("Forbidden");
    }
    const emails = await findEmailsByUserId(user.id);

    return {user, emails};
}