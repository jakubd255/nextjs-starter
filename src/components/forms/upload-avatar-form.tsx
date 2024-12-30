/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import updateProfileImageAction from "@/server-actions/update-profile-image-action";
import { useActionState, useEffect, useRef } from "react";
import { useSession } from "../providers/session-provider";
import { Button } from "../ui/button";

export default function UploadAvatarForm() {
    const {updateUser} = useSession();
    const [state, action] = useActionState(updateProfileImageAction, undefined);

    useEffect(() => {
        if(state?.success && state.profileImage) {
            updateUser({profileImage: state.profileImage});
        }
    }, [state]);

    const buttonRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    
    const handleButtonClick = () => buttonRef.current?.click();
    const handleSubmit = () => formRef.current?.requestSubmit();

    return(
        <form action={action} ref={formRef}>
            <Button variant="outline" onClick={handleButtonClick} type="button">
                Upload image
            </Button>
            <input type="file" ref={buttonRef} name="image" onChange={handleSubmit} hidden/>
        </form>
    );
}