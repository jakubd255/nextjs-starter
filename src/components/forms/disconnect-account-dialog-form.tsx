/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import disconnectAccountAction from "@/server-actions/disconnect-account-action";
import { useActionState, useEffect, useRef } from "react";
import { useAccountSettings } from "../providers/account-settins-provider";

interface DisconnectAccountDialogFormProps {
    name: string;
    provider: "github";
}

export default function DisconnectAccountDialogForm({name, provider}: DisconnectAccountDialogFormProps) {
    const [state, action] = useActionState(disconnectAccountAction, undefined);
    const ref = useRef<HTMLButtonElement>(null);
    const {deleteAccount} = useAccountSettings();

    useEffect(() => {
        if(state?.success) {
            deleteAccount(provider);
            ref.current?.click();
        }
    }, [state]);

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="!h-8 !w-8">
                    <Trash2 className="h-4 w-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Disconnect {name}
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to disconnect your {name} account? You will not be able to login with {name} after disconnecting.
                    </DialogDescription>
                </DialogHeader>
                <form id="disconnectAccountForm" action={action} hidden>
                    <input type="hidden" value={provider} name="provider" hidden/>
                </form>
                <DialogFooter>
                    <DialogClose>
                        <Button variant="outline" ref={ref}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" form="disconnectAccountForm">
                        Disconnect
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}