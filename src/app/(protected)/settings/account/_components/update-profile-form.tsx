"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import updateProfileAction from "@/actions/user/update-profile";
import useActionStateSuccess from "@/hooks/use-action-state-success";
import { useSession } from "@/components/providers/session-provider";
import FormSubmitError from "@/components/form-submit-error";
import FormSubmitButton from "@/components/form-submit-button";
import UserAvatar from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import useImageInput from "@/hooks/use-image-input";

export default function UpdateProfileForm() {
    const {user, updateUser} = useSession();
    const [name, setName] = useState<string>(user.name);
    const [bio, setBio] = useState<string>(user.bio ?? "");
    const {deleteImage, previewUrl, inputRef, handleSelect, handleDelete, handleReset} = useImageInput()

    const [state, action, pending] = useActionStateSuccess(updateProfileAction, (state) => {
        updateUser(state as Partial<User>);
        handleReset();
    });

    const disabled = name === user.name && bio === user.bio && !(previewUrl || deleteImage);

    return(
        <form action={action} className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
                <UserAvatar 
                    user={user} 
                    size="md" 
                    url={previewUrl} 
                    deleteImage={deleteImage}
                />
                <label htmlFor="image">
                    <Button variant="outline" type="button" asChild>
                        <span className="cursor-pointer">
                            {(user.profileImage || previewUrl) ? "Update image" : "Set image"}
                        </span>
                    </Button>
                </label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    className="hidden"
                    ref={inputRef}
                    onChange={handleSelect}
                />
                {(user.profileImage && !deleteImage) ? (
                    <Button 
                        variant="outline" 
                        type="button" 
                        onClick={handleDelete}
                    >
                        Delete image
                    </Button>
                ): null}
                {(deleteImage || previewUrl) ? (
                    <Button
                        variant="outline" 
                        type="button"
                        onClick={handleReset}
                    >
                        Cancel
                    </Button>
                ): null}

                {deleteImage ? (
                    <input type="hidden" name="deleteImage" value="true"/>
                ) : null}
            </div>
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
                <FormSubmitError errors={state?.errors?.bio}/>
            </div>
            <div>
                <FormSubmitButton pending={pending} variant="outline" disabled={disabled}>
                    Update
                </FormSubmitButton>
            </div>
        </form>
    );
}