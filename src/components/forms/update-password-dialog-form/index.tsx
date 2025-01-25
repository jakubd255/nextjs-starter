import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UpdatePasswordDialogContent from "./update-password-dialog-content";

export default function UpdatePasswordDialogForm() {
    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Update password
                </Button>
            </DialogTrigger>
            <DialogContent>
                <UpdatePasswordDialogContent/>
            </DialogContent>
        </Dialog>
    );
}