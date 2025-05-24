"use client";

import updateProfileImageAction from "@/actions/user/update-profile-image";
import useButtonRef from "@/hooks/use-button-ref";
import useFormRef from "@/hooks/use-form-ref";
import useActionStateSuccess from "@/hooks/use-action-state-success";
import { useSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";

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