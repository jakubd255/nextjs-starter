"use client";

import { Role, User } from "@/lib/types";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useActionState } from "react";
import updateRoleAction from "@/actions/users/update-role";
import { ActionResult } from "@/lib/action-result";
import { Button } from "@/components/ui/button";
import FormSubmitButton from "@/components/form-submit-button";


const getRoleWarning = (current: Role, next: Role) => {
    if(current !== "ADMIN" && next === "ADMIN") {
        return {
            title: "Grant administrator access",
            description: "This action will grant full administrative privileges to this user. Administrators have access to sensitive system controls.",
        };
    }

    if(current === "ADMIN" && next !== "ADMIN") {
        return {
            title: "Revoke administrator Access",
            description:"This will remove administrative privileges from this user. They will no longer have access to admin features.",
        };
    }

    return {
        title: "Update user role",
        description: `You are about to change this user's role from ${current} to ${next}. This will update their permissions immediately.`,
    };
}

interface UpdateUserRoleProps {
    user: User;
    role: Role;
    onChange?: (result: ActionResult, role: Role) => void;
}

export default function UpdateUserRoleDialog({user, role, onChange}: UpdateUserRoleProps) {
    const [_, action, pending] = useActionState(async () => {
        const result = await updateRoleAction(user.id, role);
        onChange?.(result, role);
        return result;
    }, undefined);

    const warning = getRoleWarning(user.role, role);

    return(
        <form className="flex flex-col gap-4" action={action}>
            <DialogHeader>
                <DialogTitle>
                    {warning.title}
                </DialogTitle>
                <DialogDescription>
                    {warning.description}
                </DialogDescription>
            </DialogHeader>
            <input type="hidden" name="id" defaultValue={user.id} hidden/>
            <input type="hidden" name="role" defaultValue={role} hidden/>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton pending={pending}>
                    Confirm
                </FormSubmitButton>
            </DialogFooter>
        </form>
    );
}