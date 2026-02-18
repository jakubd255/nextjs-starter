"use client";

import blockUserAction from "@/actions/users/block-user";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { handleActionResult } from "@/lib/action-result";
import { User } from "@/lib/types";

interface SecuritySectionProps {
    user: User;
}

export default function SecuritySection({user}: SecuritySectionProps) {
    const handleToggleBlocked = async () => {
        const result = await blockUserAction(user.id);
        handleActionResult(result, !user.blocked ? "Successfully blocked user" : "Successfully unlocked user");
    }
    
    return(
        <>
            <Separator/>
            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">
                    Security
                </h2>
                <div>
                    <Select defaultValue={String(user.blocked)} onValueChange={handleToggleBlocked}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selct status"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="false" disabled={!user.blocked}>
                                Active
                            </SelectItem>
                            <SelectItem value="true" disabled={user.blocked}>
                                Blocked
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>
        </>
    );
}