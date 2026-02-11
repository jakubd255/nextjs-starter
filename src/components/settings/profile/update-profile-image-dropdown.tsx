"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pencil } from "lucide-react";

interface UpdateProfileImageDropdownProps {
    onUpload: () => void;
    onSetFromUrl: () => void;
    onRemove: () => void;
}

export default function UpdateProfileImageDropdown({onUpload, onSetFromUrl, onRemove}: UpdateProfileImageDropdownProps) {
    return(
        <div className="absolute left-0 bottom-0">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <Pencil className="w-4 h-4"/> Edit
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={onUpload}>
                        Upload image
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onSetFromUrl}>
                        Set image form URL
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onRemove}>
                        Remove image
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}