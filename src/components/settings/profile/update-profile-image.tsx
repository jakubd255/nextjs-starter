"use client";

import { Label } from "@/components/ui/label";
import UserAvatar from "@/components/kit/user-avatar";
import { useTransition } from "react";
import updateAvatarAction from "@/actions/users/update-avatar";
import { UserProfile } from "@/db/schema/users";
import InstantImageInput from "@/components/kit/image-input/instant-image-input";
import { handleActionResult } from "@/lib/utils/action-result";

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

    return(
        <div className="relative w-min h-min">
            <Label>
                Profile image
            </Label>
            <UserAvatar user={user} size="xl"/>
            <InstantImageInput
                className="absolute bottom-0 left-0"
                hasImage={!!user.profileImage}
                onSubmit={submit}
                disabled={pending}
            />
        </div>
    );
}