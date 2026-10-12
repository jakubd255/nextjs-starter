"use client";

import { Button } from "../ui/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import FormSubmitButton from "./form/form-submit-button";

interface Props {
    title: string;
    description?: string | React.ReactNode[];
    confirmText?: string;
    variant?: React.ComponentProps<typeof Button>["variant"];
    action: (payload: FormData) => void;
    pending?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
}

export default function ActionDialog({title, description, confirmText = "Confirm", variant, action, pending, disabled, children}: Props) {
    return(
        <form className="flex flex-col gap-4" action={action}>
            <DialogHeader>
                <DialogTitle>
                    {title}
                </DialogTitle>
                {description && (
                    <DialogDescription style={{whiteSpace: "pre-line"}}>
                        {description}
                    </DialogDescription>
                )}
            </DialogHeader>
            {children}
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton 
                    variant={variant} 
                    pending={pending} 
                    disabled={disabled}
                >
                    {confirmText}
                </FormSubmitButton>
            </DialogFooter>
        </form>
    );
}