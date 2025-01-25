"use client";

import { useSession } from "../providers/session-provider";
import { Button } from "../ui/button";
import updateProfileImageAction from "@/server-actions/user/update-profile-image";
import useButtonRef from "@/hooks/useButtonRef";
import useFormRef from "@/hooks/useFormRef";
import useActionStateSuccess from "@/hooks/useActionStateSuccess";

export default function UploadAvatarForm() {
    const {updateUser} = useSession();
    
    const [_, action] = useActionStateSuccess(updateProfileImageAction, (state) => {
        updateUser({profileImage: state.profileImage});
    });

    const buttonRef = useButtonRef();
    const formRef = useFormRef();

    return(
        <form action={action} ref={formRef.ref}>
            <Button variant="outline" onClick={buttonRef.click} type="button">
                Upload image
            </Button>
            <input type="file" ref={buttonRef.ref} name="image" onChange={formRef.submit} hidden/>
        </form>
    );
}