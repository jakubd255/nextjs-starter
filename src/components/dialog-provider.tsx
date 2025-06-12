import { PropsWithChildren, ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

interface DialogProviderProps {
    text: string | ReactNode;
    destructive?: boolean;
}

export default function DialogProvider({children, text, destructive = false}: PropsWithChildren<DialogProviderProps>) {
    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={destructive ? "destructive" : "outline"}>
                   {text}
                </Button>
            </DialogTrigger>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    );
}