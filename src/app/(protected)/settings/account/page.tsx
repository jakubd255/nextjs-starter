import { AccountSettingsProvider } from "@/app/(protected)/settings/account/_components/account-settins-provider";
import { Separator } from "@/components/ui/separator";
import { validateRequest } from "@/lib/auth";
import { findEmailsByUserId } from "@/db/queries/emails";
import { Metadata } from "next";
import ProfileSection from "./_components/profile-section";
import EmailSection from "./_components/email-section";
import PasswordSection from "./_components/password-section";
import DeleteAccountSection from "./_components/delete-account-section";

export const metadata: Metadata = {
    title: "Account settings | NextJS App",
};

export default async function AccountSettingsPage() {
    const {emails} = await getData();

    return(
        <AccountSettingsProvider value={{emails}}>
            <div className="flex flex-col gap-8 pb-10 max-w-[600px] w-full">
                <h1 className="text-center">
                    Account settings
                </h1>
                <ProfileSection/>
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