"use client";

import { Label } from "@/components/ui/label";
import UserAvatar from "@/components/user-avatar";
import { useRef, useState } from "react";
import UpdateProfileImageDropdown from "./update-profile-image-dropdown";
import DialogLauncher from "@/components/dialog-launcher";
import UpdateProfileImageUrlForm from "./update-profile-image-url-form";
import updateAvatarAction from "@/actions/users/update-avatar";
import UpdateProfileImageUpload from "./update-profile-image-upload";
import { User } from "@/lib/types";

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
                onUpload={() => fileInputRef.current?.click()} 
                onSetFromUrl={() => setDialogOpen(true)} 
                onRemove={handleDeleteImage}
            />
            <DialogLauncher open={isDialogOpen} onOpenChange={handleToggleOpen}>
                <UpdateProfileImageUrlForm user={user} onUpdate={handleSetImageUrl}/>
            </DialogLauncher>
            <UpdateProfileImageUpload user={user} inputRef={fileInputRef}/>
        </div>
    );
}