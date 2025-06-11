import { MutableRefObject, ReactNode } from "react";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import FormSubmitButton from "./form-submit-button";

interface DialogContentProviderProps {
    children: ReactNode;
    title: string;
    description?: string;
    confirm: string;
    destructive?: boolean;
    pending?: boolean;
    form?: string;
    ref?: MutableRefObject<any>;
    disabled?: boolean;
}

export default function DialogContentProvider({
    children, 
    title, 
    description, 
    confirm, 
    destructive, 
    pending=false, 
    form, 
    ref, 
    disabled
}: DialogContentProviderProps) {
    return(
        <>
            <DialogHeader>
                <DialogTitle>
                    {title}
                </DialogTitle>
                {description ? (
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                ) : null}
            </DialogHeader>
            {children}
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" ref={ref}>
                        Cancel
                    </Button>
                </DialogClose>
                <FormSubmitButton 
                    variant={destructive ? "destructive" : "default"}
                    form={form} 
                    pending={pending} 
                    disabled={disabled}
                >
                    {confirm}
                </FormSubmitButton>
            </DialogFooter>
        </>
    );
}