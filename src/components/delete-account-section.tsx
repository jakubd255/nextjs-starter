import DeleteAccountDialogForm from "./forms/delete-account-dialog-form";

export default function DeleteAccountSection() {
    return(
        <section className="flex flex-col gap-2">
            <h2>
                Delete account
            </h2>
            <div>
                <DeleteAccountDialogForm/>
            </div>
        </section>
    )
}


/*

*/