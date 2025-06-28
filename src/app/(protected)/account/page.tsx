import { Separator } from "@/components/ui/separator";
import { validateRequest } from "@/lib/auth";
import { findEmailsByUserId } from "@/db/queries/emails";
import { Metadata } from "next";
import ProfileSection from "./_components/profile-section";
import EmailSection from "./_components/email-section";
import UpdatePasswordSection from "./_components/update-password-section";
import DeleteAccountSection from "./_components/delete-account-section";
import { forbidden } from "next/navigation";
import { AccountSettingsProvider } from "./_components/account-settings-provider";

export const metadata: Metadata = {
    title: "Account settings | NextJS App",
};

export default async function AccountSettingsPage() {
    const {user} = await validateRequest();
    if(!user) {
        forbidden();
    }
    
    const emails = await findEmailsByUserId(user.id);

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
                <UpdatePasswordSection/>
                <Separator/>
                <DeleteAccountSection/>
            </div>
        </AccountSettingsProvider>
    );
}