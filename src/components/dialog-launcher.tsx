import { ForwardRefExoticComponent, PropsWithChildren, ReactNode, RefAttributes } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { LucideProps } from "lucide-react";

interface DialogLauncherProps {
    text?: string;
    icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    variant?: "destructive" | "outline" | "link" | "default" | "secondary" | "ghost" | null;
    trigger?: ReactNode;
    open?: boolean;
    disabled?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function DialogLauncher(props: PropsWithChildren<DialogLauncherProps>) {
    return(
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            {props.text || props.icon ? (
                <DialogTrigger asChild>
                    {props.text ? (
                        <Button variant={props.variant} disabled={props.disabled}>
                            {props.icon ? <props.icon/> : null}
                            {props.text}
                        </Button>
                    ) : props.icon ? (
                        <Button variant={props.variant || "outline"} size="icon" disabled={props.disabled}>
                            <props.icon/>
                        </Button>
                    ) : null}
                </DialogTrigger>
            ) : null}
            <DialogContent>
                {props.children}
            </DialogContent>
        </Dialog>
    );
}