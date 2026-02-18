import { Metadata } from "next";
import { APP_TITLE } from "@/lib/constants";
import { validateRequest } from "@/lib/auth";
import { getOAuthProvidersByUserId } from "@/db/queries/providers";
import { forbidden } from "next/navigation";
import ProvidersList from "@/components/settings/connections/providers-list";

export const metadata: Metadata = {
    title: `Connected accounts | ${APP_TITLE}`
};

export default async function SettingsConnectionstPage() {
    const {user} = await validateRequest();
    if(!user) {
        forbidden();
    }

    const providers = await getOAuthProvidersByUserId(user.id);

    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                Connected accounts
            </h1>
            <ProvidersList providers={providers}/>
        </div>
    );
}