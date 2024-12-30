"use client";

import Link from "next/link";
import DisconnectAccountDialogForm from "./forms/disconnect-account-dialog-form";
import { GitHubIcon } from "./image-icons";
import { useAccountSettings } from "./providers/account-settins-provider";
import { Button } from "./ui/button";

export default function GitHubAccountCard() {
    const {getAccount} = useAccountSettings();
    const github = getAccount("github");

    return(
        <div className="p-3 border rounded-md flex justify-between items-center">
            <div className="flex flex-col gap-3">
                <div className="flex">
                    <GitHubIcon/>
                    GitHub
                </div>
                {github && (
                    <span className="text-sm">
                        Username: @{github.username}
                    </span>
                )}
            </div>
            {github ? (
                <DisconnectAccountDialogForm name="GitHub" provider="github"/>
            ) : (
                <Button variant="outline" asChild>
                    <Link href="/api/auth/github">
                        Connect
                    </Link>
                </Button>
            )}
        </div>
    );
}