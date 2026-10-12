"use client";

import blockUserAction from "@/actions/users/block-user";
import { Separator } from "@/components/ui/separator";
import { handleActionResult } from "@/lib/utils/action-result";
import { User } from "@/db/schema/users";
import SelectInput, { SelectOption } from "@/components/kit/form/select-input";

interface Props {
    user: User;
}

const STATUS_OPTIONS: SelectOption[] = [
    {value: "false", label: "Active"},
    {value: "true", label: "Blocked"}
];

export default function SecuritySection({user}: Props) {
    const handleToggleBlocked = async () => {
        const result = await blockUserAction(user.id);
        handleActionResult(result);
    }

    const options = STATUS_OPTIONS.map(o => ({...o, disabled: o.value === String(user.blocked)}));
    
    return(
        <>
            <Separator/>
            <section className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">
                    Security
                </h2>
                <SelectInput
                    options={options}
                    defaultValue={String(user.blocked)}
                    onValueChange={handleToggleBlocked}
                    placeholder="Select status"
                />
            </section>
        </>
    );
}