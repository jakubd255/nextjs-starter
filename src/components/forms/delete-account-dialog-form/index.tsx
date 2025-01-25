import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DeleteAccountDialogContent from "./delete-account-dialog-content";

export default function DeleteAccountDialogForm() {
    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    Delete account
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DeleteAccountDialogContent/>
            </DialogContent>
        </Dialog>
    );
}