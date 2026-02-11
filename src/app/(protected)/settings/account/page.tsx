import { Separator } from "@/components/ui/separator";
import EmailSection from "@/components/settings/account/email-section";
import PasswordSection from "@/components/settings/account/password-section";
import DeleteAccountSection from "@/components/settings/account/delete-account-section";

export default function SettingsAccountPage() {
    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                Account
            </h1>
            <EmailSection/>
            <Separator/>
            <PasswordSection/>
            <Separator/>
            <DeleteAccountSection/>
        </div>
    );
}