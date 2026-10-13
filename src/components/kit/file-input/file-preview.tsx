import { FileItem, itemName, resolveMedia } from "@/lib/upload/file-items";
import { FilePolicy } from "@/lib/upload/policy";
import { cn } from "@/lib/utils/cn";
import { FileIcon } from "lucide-react";

export default function FilePreview({item, policy, className}: {item: FileItem; policy: FilePolicy; className?: string}) {
    const media = resolveMedia(item, policy);

    if(media === "image") {
        return(
            <img 
                src={item.preview} 
                alt="" 
                referrerPolicy="no-referrer" 
                className={cn("size-full object-cover", className)}
            />
        );
    }
    if(media === "video") {
        return(
            <video 
                src={item.preview} 
                muted 
                preload="metadata" 
                className={cn("size-full object-cover", className)}
            />
        );
    }
    return(
        <div className={cn("flex size-full flex-col items-center justify-center gap-1 p-2 text-muted-foreground", className)}>
            <FileIcon className="size-8 shrink-0" />
            <span className="w-full truncate text-center text-xs">{itemName(item)}</span>
        </div>
    );
}