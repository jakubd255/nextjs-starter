"use client";

import DialogLauncher from "@/components/dialog-launcher";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Role, ROLES } from "@/lib/auth/permissions";
import { User } from "@/db/schema/users";
import UpdateUserRoleDialog from "./update-user-role-dialog";
import { useState } from "react";

interface RoleSectionProps {
    user: User;
}

export default function RoleSection({user}: RoleSectionProps) {
    const [pendingRole, setPendingRole] = useState<Role | null>(null);

    return(
        <>
            <Separator/>
            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">
                    Role
                </h2>
                <div>
                    <Select value={user.role} onValueChange={value => setPendingRole(value as Role)}>
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
            </section>
            {!!pendingRole ? (
                <DialogLauncher 
                    open={!!pendingRole} 
                    onOpenChange={() => setPendingRole(null)}
                >
                    <UpdateUserRoleDialog 
                        user={user} 
                        role={pendingRole} 
                        onSuccess={() => setPendingRole(null)}
                    />
                </DialogLauncher>
            ) : null}
        </>
    );
}