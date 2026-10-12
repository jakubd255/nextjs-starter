"use client";

import { createContext, useContext, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { LucideIcon } from "lucide-react";

type ButtonVariant = React.ComponentProps<typeof Button>["variant"];

type TriggerProps = {variant?: ButtonVariant; className?: string} & (
    | {text: string; icon?: LucideIcon; label?: string}
    | {text?: undefined; icon?: LucideIcon; label?: string}
);

const DialogControl = createContext<{close: () => void} | null>(null);

export const useDialogControl = () => {
    const ctx = useContext(DialogControl);
    if(!ctx) throw new Error("useDialogControl must be used inside <DialogLauncher>");
    return ctx;
}

interface Props {
    trigger?: TriggerProps;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    disabled?: boolean;
    children: React.ReactNode;
}

export default function DialogLauncher({trigger, open: openProp, onOpenChange, className, disabled, children}: Props) {
    const [innerOpen, setInnerOpen] = useState(false);
    const controlled = openProp !== undefined;
    const open = controlled ? openProp : innerOpen;

    const setOpen = (value: boolean) => {
        if(!controlled) setInnerOpen(value);
        onOpenChange?.(value);
    };
    
    return(
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && (
                <DialogTrigger asChild>
                    <Button
                        variant={trigger.variant || "outline"}
                        size={trigger.text ? "default" : "icon"}
                        className={trigger.className}
                        aria-label={trigger.label}
                        disabled={disabled}
                    >
                        {trigger.icon ? <trigger.icon/> : null}
                        {trigger.text}
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className={className}>
                <DialogControl.Provider value={{close: () => setOpen(false)}}>
                    {children}
                </DialogControl.Provider>
            </DialogContent>
        </Dialog>
    );
}