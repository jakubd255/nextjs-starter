"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import FormSubmitError from "../form-submit-error";
import { useSession } from "../providers/session-provider";
import FormSubmitButton from "../form-submit-button";
import updateProfileAction from "@/server-actions/user/update-profile";
import useActionStateSuccess from "@/hooks/useActionStateSuccess";

export default function UpdateProfileForm() {
    const {user, updateUser} = useSession();
    const [name, setName] = useState<string>(user.name);
    const [bio, setBio] = useState<string>(user.bio ?? "");

    const [state, action, pending] = useActionStateSuccess(updateProfileAction, () => {
        updateUser({name, bio});
    });

    const isDisabled = name === user.name && bio === user.bio;

    return(
        <form action={action} className="flex flex-col gap-1">
            <div>
                <Label htmlFor="name">
                    Name
                </Label>
                <Input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)}/>
                <FormSubmitError errors={state?.errors?.name}/>
            </div>
            <div>
                <Label htmlFor="bio">
                    Bio
                </Label>
                <Textarea name="bio" id="bio" value={bio} onChange={e => setBio(e.target.value)}/>
                <FormSubmitError errors={state?.errors?.bio}/>
            </div>
            <div>
                <FormSubmitButton pending={pending} variant="outline" disabled={isDisabled}>
                    Update
                </FormSubmitButton>
            </div>
        </form>
    );
}