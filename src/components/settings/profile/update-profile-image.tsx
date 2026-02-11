"use client";

import { Label } from "@/components/ui/label";
import UserAvatar from "@/components/user-avatar";
import { User } from "lucia";
import { useRef, useState } from "react";
import UpdateProfileImageDropdown from "./update-profile-image-dropdown";
import DialogProvider from "@/components/dialog-provider";
import UpdateProfileImageUrlForm from "./update-profile-image-url-form";
import updateAvatarAction from "@/actions/users/update-avatar";
import UpdateProfileImageUpload from "./update-profile-image-upload";

interface UpdateProfileImageFormProps {
    user: User;
    onUpdate?: (profileImage?: string | null) => void;
}

export default function UpdateProfileImage({user, onUpdate}: UpdateProfileImageFormProps) {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const handleToggleOpen = (open: boolean) => setDialogOpen(open);

    const handleSetImageUrl = (profileImage?: string | null) => {
        if(onUpdate) {
            onUpdate(profileImage);
            setDialogOpen(false);
        }
    }

    const handleDeleteImage = async () => {
        const formData = new FormData();
        formData.append("id", user.id);
        formData.append("remove", "true");
        await updateAvatarAction(null, formData);
        if(onUpdate) onUpdate(null);
    }

    const fileInputRef = useRef<HTMLInputElement>(null);

    return(
        <div className="relative w-min h-min">
            <Label>
                Profile image
            </Label>
            <UserAvatar user={user} size="xl"/>
            <UpdateProfileImageDropdown 
                onUpload={() => {}} 
                onSetFromUrl={() => setDialogOpen(true)} 
                onRemove={handleDeleteImage}
            />
            <DialogProvider open={isDialogOpen} onOpenChange={handleToggleOpen}>
                <UpdateProfileImageUrlForm user={user} onUpdate={handleSetImageUrl}/>
            </DialogProvider>
            <UpdateProfileImageUpload user={user} inputRef={fileInputRef}/>
        </div>
    );
}