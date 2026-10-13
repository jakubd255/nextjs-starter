import { cn } from "@/lib/utils/cn";
import { Plus } from "lucide-react";
import { ComponentProps } from "react";

interface Props extends ComponentProps<"button"> {
    label?: string;
}

export default function FileAddTrigger({label = "Add", className, ...props}: Props) {
    return(
        <button
            type="button"
            className={cn(
                "flex size-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed",
                "text-sm text-muted-foreground transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
                className,
            )}
            {...props}
        >
            <Plus className="size-6"/>
            {label}
        </button>
    );
}