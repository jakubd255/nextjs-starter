import { cn } from "@/lib/utils/cn";

export function Form({className, ...props}: React.ComponentProps<"form">) {
    return <form className={cn("flex flex-col gap-6", className)} {...props} />;
}

export function FieldGroup({className, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("flex flex-col gap-3", className)} {...props} />;
}