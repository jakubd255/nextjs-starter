import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteSessionProps {
    isThisDevice: boolean;
    deleteSession: () => void;
}

export default function DeleteSession({isThisDevice, deleteSession}: DeleteSessionProps) {
    if(isThisDevice) return(
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="!h-8 !w-8" 
                >
                    <Trash2 className="h-4 w-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    Delete session
                </DialogTitle>
                <DialogDescription>
                    This is the session for the device you are using now. Once deleted you will be logged out.
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
            </DialogContent>
        </Dialog>
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