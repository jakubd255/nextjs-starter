import { PropsWithChildren, ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

interface DialogProviderProps {
    text?: string;
    icon?: ReactNode;
    destructive?: boolean;
    trigger?: ReactNode;
}

export default function DialogProvider({children, icon, text, destructive = false}: PropsWithChildren<DialogProviderProps>) {
    return(
        <Dialog>
            <DialogTrigger asChild>
                {text ? (
                    <Button variant={destructive ? "destructive" : "outline"}>
                        {text}
                    </Button>
                ) : icon ? (
                    <Button variant="outline" size="icon" className="!h-8 !w-8" >
                        {icon}
                    </Button>
                ) : null}
            </DialogTrigger>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    );
}