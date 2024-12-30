import deleteAccountAction from "@/server-actions/delete-account-action";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export default function DeleteAccountDialogForm() {
    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" className="w-max mx-auto">
                    Delete account
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete account
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure to delete your account? You will lose your data immediately and you won&apos;t be able to get it back.
                    </DialogDescription>
                    <form id="deleteAccountForm" action={deleteAccountAction}>
                    </form>
                    <DialogFooter>
                        <DialogClose>
                            <Button variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="destructive" form="deleteAccountForm">
                            Delete account
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}