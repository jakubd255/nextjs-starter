"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

interface FormSubmitButtonProps {
    children: React.ReactNode;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    disabled?: boolean | undefined
}

export default function FormSubmitButton({children, variant, disabled}: FormSubmitButtonProps) {
    const {pending} = useFormStatus();

    const isDisabled = disabled || pending;

    return(
        <Button type="submit" variant={variant} disabled={isDisabled}>
            {(pending && !["link"].includes(variant!)) ? 
                (<LoaderCircle className="animate-spin"/>) 
            : children}
        </Button>
    );
}