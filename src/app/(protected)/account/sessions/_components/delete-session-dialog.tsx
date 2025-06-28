import { DialogClose, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import DialogProvider from "@/components/dialog-provider";

interface DeleteSessionProps {
    isThisDevice: boolean;
    deleteSession: () => void;
}

export default function DeleteSessionDialog({isThisDevice, deleteSession}: DeleteSessionProps) {
    if(isThisDevice) return (
        <DialogProvider icon={(
            <Trash2 className="h-4 w-4"/>
        )}>
            <DialogTitle>
                Delete session
            </DialogTitle>
            <DialogDescription>
                This is the session for the device you are using now.
                Once deleted you will be logged out.
            </DialogDescription>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">
                        Cancel
                    </Button>
                </DialogClose>
                <Button variant="destructive" onClick={deleteSession}>
                    Delete
                </Button>
            </DialogFooter>
        </DialogProvider>
    );
    
    else return(
        <Button 
            variant="outline" 
            size="icon" 
            className="!h-8 !w-8" 
            onClick={deleteSession}
        >
            <Trash2 className="h-4 w-4"/>
        </Button>
    );
}