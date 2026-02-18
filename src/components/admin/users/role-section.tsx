"use client";

import DialogLauncher from "@/components/dialog-launcher";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ROLES } from "@/lib/auth/permissions";
import { Role, User } from "@/lib/types";
import UpdateUserRoleDialog from "./update-user-role-dialog";
import { ActionResult, handleActionResult } from "@/lib/action-result";
import { useState } from "react";

interface RoleSectionProps {
    user: User;
}

export default function RoleSection({user}: RoleSectionProps) {
    const [dialog, setDialog] = useState<Role | null>(null);

    const onUpdateRole = async (result: ActionResult, role: Role) => {
        handleActionResult(result, `Successfully updated role to ${role}`);
        setDialog(null);
    }

    return(
        <>
            <Separator/>
            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">
                    Role
                </h2>
                <div>
                    <Select value={user.role} onValueChange={value => setDialog(value as Role)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selct role"/>
                        </SelectTrigger>
                        <SelectContent>
                            {ROLES.map(role => (
                                <SelectItem key={role} value={role} disabled={role === user.role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {dialog}
            </section>
            {!!dialog ? (
                <DialogLauncher open={!!dialog} onOpenChange={() => setDialog(null)}>
                    <UpdateUserRoleDialog user={user} role={dialog} onChange={onUpdateRole}/>
                </DialogLauncher>
            ) : null}
        </>
    );
}