import { ForwardRefExoticComponent, PropsWithChildren, ReactNode, RefAttributes } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { LucideProps } from "lucide-react";

interface DialogProviderProps {
    text?: string;
    icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    destructive?: boolean;
    trigger?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function DialogProvider(props: PropsWithChildren<DialogProviderProps>) {
    return(
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            {props.text || props.icon ? (
                <DialogTrigger asChild>
                    {props.text ? (
                        <Button variant={props.destructive ? "destructive" : "outline"}>
                            {props.icon ? <props.icon/> : null}
                            {props.text}
                        </Button>
                    ) : props.icon ? (
                        <Button variant="outline" size="icon" className="h-8! w-8!" >
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