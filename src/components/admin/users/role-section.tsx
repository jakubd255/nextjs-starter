"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Role, ROLES } from "@/lib/auth/permissions";
import { User } from "@/db/schema/users";
import UpdateUserRoleDialog from "./update-user-role-dialog";
import { useState } from "react";
import DialogLauncher from "@/components/kit/dialog-launcher";
import SelectInput, { SelectOption } from "@/components/kit/form/select-input";

interface Props {
    user: User;
}

const ROLE_OPTIONS = (current: Role): SelectOption[] => 
    ROLES.map(role => ({value: role, label: role, disabled: role === current}));

export default function RoleSection({user}: Props) {
    const [pendingRole, setPendingRole] = useState<Role | null>(null);

    return(
        <>
            <Separator/>
            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">
                    Role
                </h2>
                <SelectInput
                    options={ROLE_OPTIONS(user.role)}
                    value={user.role}
                    onValueChange={value => setPendingRole(value as Role)}
                    placeholder="Select role"
                />
            </section>
            {!!pendingRole ? (
                <DialogLauncher 
                    open={!!pendingRole} 
                    onOpenChange={() => setPendingRole(null)}
                >
                    <UpdateUserRoleDialog 
                        user={user} 
                        role={pendingRole} 
                    />
                </DialogLauncher>
            ) : null}
        </>
    );
}