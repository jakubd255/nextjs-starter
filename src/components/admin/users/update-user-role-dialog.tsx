"use client";

import { User } from "@/db/schema/users";
import updateRoleAction from "@/actions/users/update-role";
import { Role } from "@/lib/auth/permissions";
import { useFormAction } from "@/lib/hooks/use-form-action";
import ActionDialog from "@/components/kit/action-dialog";
import { useDialogControl } from "@/components/kit/dialog-launcher";

const getRoleWarning = (current: Role, next: Role) => {
    if(current !== "ADMIN" && next === "ADMIN") {
        return {
            title: "Grant administrator access",
            description: "This action will grant full administrative privileges to this user. Administrators have access to sensitive system controls.",
        };
    }

    if(current === "ADMIN" && next !== "ADMIN") {
        return {
            title: "Revoke administrator access",
            description:"This will remove administrative privileges from this user. They will no longer have access to admin features.",
        };
    }

    return {
        title: "Update user role",
        description: `You are about to change this user's role from ${current} to ${next}. This will update their permissions immediately.`,
    };
}

interface Props {
    user: User;
    role: Role;
}

export default function UpdateUserRoleDialog({user, role}: Props) {
    const {close} = useDialogControl();
    const [_, action, pending] = useFormAction(() => updateRoleAction(user.id, role), {onSuccess: close});
    const warning = getRoleWarning(user.role, role);

    return(
        <ActionDialog
            title={warning.title}
            description={warning.description}
            action={action}
            pending={pending}
        />
    );
}