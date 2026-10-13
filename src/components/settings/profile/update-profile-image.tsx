"use client";

import { Label } from "@/components/ui/label";
import UserAvatar from "@/components/kit/user-avatar";
import { useTransition } from "react";
import updateAvatarAction from "@/actions/users/update-avatar";
import { UserProfile } from "@/db/schema/users";
import { handleActionResult } from "@/lib/utils/action-result";
import InstantFileInput from "@/components/kit/file-input/instant-file-input";
import { definePolicy, FILE_POLICIES } from "@/lib/upload/policy";

interface Props {
    user: UserProfile;
}

export default function UpdateProfileImage({user}: Props) {
    const [pending, startTransition] = useTransition();

    const submit = (fd: FormData) => {
        fd.set("id", user.id);
        startTransition(async () => {
            const result = await updateAvatarAction(undefined, fd);
            handleActionResult(result);
        });
    };

    const policy = definePolicy(FILE_POLICIES.images, {maxFiles: 1});

    return(
        <div className="relative w-min h-min">
            <Label>
                Profile image
            </Label>
            <UserAvatar user={user} size="xl"/>
            <InstantFileInput
                className="absolute bottom-0 left-0"
                hasFile={!!user.profileImage}
                onSubmit={submit}
                disabled={pending} 
                policy={policy}/>
        </div>
    );
}