"use client";

import updateAvatarAction from "@/actions/users/update-avatar";
import { User } from "@/lib/types";
import { RefObject, useActionState, useEffect, useRef } from "react";

interface UpdateProfileImageUploadProps {
    user: User;
    onUpdate?: (profileImage?: string | null) => void;
    inputRef: RefObject<HTMLInputElement | null>;
}

export default function UpdateProfileImageUpload({user, onUpdate, inputRef}: UpdateProfileImageUploadProps) {
    const [state, action] = useActionState(updateAvatarAction, undefined);
    
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if(state?.success) onUpdate?.(state.profileImage);
    }, [state]);
    
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