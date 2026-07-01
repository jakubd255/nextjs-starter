"use client";

import updateAvatarAction from "@/actions/users/update-avatar";
import { UserProfile } from "@/db/schema/users";
import { RefObject, useActionState, useRef } from "react";

interface UpdateProfileImageUploadProps {
    user: UserProfile;
    inputRef: RefObject<HTMLInputElement | null>;
}

export default function UpdateProfileImageUpload({user, inputRef}: UpdateProfileImageUploadProps) {
    const [_, action] = useActionState(updateAvatarAction, undefined);
    
    const formRef = useRef<HTMLFormElement>(null);
    
    return(
        <form ref={formRef} action={action}>
            <input
                type="file"
                ref={inputRef}
                name="image"
                onChange={() => formRef.current?.requestSubmit()}
                hidden
            />
            <input type="hidden" name="id" value={user.id} hidden/>
        </form>
    );
}