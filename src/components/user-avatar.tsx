import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Size = "xs" | "sm" | "md" | "lg";

interface UserAvatarProps {
    user: User;
    size?: Size;
    url?: string | null;
    deleteImage?: boolean;
}

const getSize = (size: Size) => {
    switch(size) {
        case "xs": return "w-[20px] h-[20px]";
        case "md": return "w-[100px] h-[100px]";
        case "lg": return "w-[140px] h-[140px]";
        default: return "";
    }
}

const getTextSize = (size: Size) => {
    switch(size) {
        case "md": return "text-5xl";
        case "lg": return "text-8xl";
        default: return "";
    }
}

export default function UserAvatar({user, size="sm", url, deleteImage}: UserAvatarProps) {
    const source = url ? url : !user.profileImage?.includes("http") ? "/api/download/"+user.profileImage : user.profileImage;
    
    return(
        <Avatar className={getSize(size)}>
            <AvatarFallback className={getTextSize(size)}>
                {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
            <AvatarImage src={!deleteImage ? source : undefined} draggable={false}/>
        </Avatar>
    );
}