"use client";

import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

interface FormSubmitButtonProps {
    children: React.ReactNode;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    disabled?: boolean | undefined;
    pending: boolean;
    form?: string | undefined;
    className?: string | undefined;
}

export default function FormSubmitButton({children, variant, disabled, pending, form, className}: FormSubmitButtonProps) {
    const isDisabled = disabled || pending;

    return(
        <Button type="submit" variant={variant} disabled={isDisabled} form={form} className={className}>
            {(pending && !["link"].includes(variant!)) ? 
                (<LoaderCircle className="animate-spin"/>) 
            : children}
        </Button>
    );
}