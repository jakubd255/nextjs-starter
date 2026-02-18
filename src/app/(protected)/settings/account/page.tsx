import { Separator } from "@/components/ui/separator";
import EmailSection from "@/components/settings/account/email-section";
import PasswordSection from "@/components/settings/account/password-section";
import DeleteAccountSection from "@/components/settings/account/delete-account-section";
import { Metadata } from "next";
import { APP_TITLE } from "@/lib/constants";
import { forbidden } from "next/navigation";
import { validateRequest } from "@/lib/auth";

export const metadata: Metadata = {
    title: `Account | ${APP_TITLE}`
};

export default async function SettingsAccountPage() {
    const {user} = await validateRequest();
    if(!user) {
        return forbidden();
    }

    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                Account
            </h1>
            <EmailSection/>
            <Separator/>
            <PasswordSection hasPassword={user.hasPassword}/>
            <Separator/>
            <DeleteAccountSection/>
        </div>
    );
}