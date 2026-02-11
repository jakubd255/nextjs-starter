import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface UserAvatarProps {
    user: User;
    size?: Size;
    url?: string | null;
    hideBorder?: boolean;
}

const getSize = (size: Size) => {
    switch(size) {
        case "xs": return "w-[20px] h-[20px]";
        case "md": return "w-[100px] h-[100px]";
        case "lg": return "w-[150px] h-[150px]";
        case "xl": return "w-[200px] h-[200px]";
        default: return "";
    }
}

const getTextSize = (size: Size) => {
    switch(size) {
        case "md": return "text-5xl";
        case "lg": return "text-8xl";
        case "xl": return "text-9xl";
        default: return "";
    }
}

export default function UserAvatar({user, size="sm", url, hideBorder}: UserAvatarProps) {
    const source = url ? url : user.profileImage ?? undefined;
    
    return(
        <Avatar className={cn(getSize(size), !hideBorder ? "border" : null)}>
            <AvatarFallback className={getTextSize(size)}>
                {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
            <AvatarImage src={source} draggable={false}/>
        </Avatar>
    );
}
