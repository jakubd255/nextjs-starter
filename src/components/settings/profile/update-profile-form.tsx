"use client";

import { useActionState, useState } from "react";
import updateProfileAction from "@/actions/users/update-profile";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormSubmitError from "@/components/form-submit-error";
import { Textarea } from "@/components/ui/textarea";
import FormSubmitButton from "@/components/form-submit-button";
import { UserProfile } from "@/db/schema/users";

interface UpdateProfileFormProps {
    user: UserProfile;
}

export default function UpdateProfileForm({user}: UpdateProfileFormProps) {
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio ?? "");

    const [state, action, pending] = useActionState(updateProfileAction, undefined);

    const disabled = name === user.name && bio === (user.bio ?? "");

    return(
        <form className="flex flex-col gap-3 w-full" action={action}>
            <div className="flex flex-col gap-3">
                <div>
                    <Label htmlFor="name">
                        Name
                    </Label>
                    <Input 
                        type="text" 
                        name="name" 
                        id="name" 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                    />
                    <FormSubmitError errors={state?.errors?.name}/>
                </div>
                <div>
                    <Label htmlFor="bio">
                        Bio
                    </Label>
                    <Textarea 
                        name="bio" 
                        id="bio" 
                        value={bio} 
                        onChange={e => setBio(e.target.value)}
                    />
                </div>
                <input type="hidden" name="id" defaultValue={user.id} hidden/>
            </div>
            <div className="flex">
                <FormSubmitButton pending={pending} disabled={disabled}>
                    Update
                </FormSubmitButton>
            </div>
        </form>
    );
}