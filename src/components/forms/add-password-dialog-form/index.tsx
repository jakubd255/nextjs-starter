import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddPasswordDialogContent from "./add-password-dialog-content";

export default function AddPasswordDialogForm() {
    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Add password
                </Button>
            </DialogTrigger>
            <DialogContent>
                <AddPasswordDialogContent/>
            </DialogContent>
        </Dialog>
    );
}