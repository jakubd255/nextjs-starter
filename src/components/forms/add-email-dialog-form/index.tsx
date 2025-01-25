import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddEmailDialogContent from "./add-email-dialog-content";

export default function AddEmailDialogForm() {
    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Add email
                </Button>
            </DialogTrigger>
            <DialogContent>
                <AddEmailDialogContent/>
            </DialogContent>
        </Dialog>
    );
}