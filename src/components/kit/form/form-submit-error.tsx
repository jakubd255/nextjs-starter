interface FormSubmitErrorProps {
    errors: string[] | undefined;
}

export default function FormSubmitError({errors}: FormSubmitErrorProps) {
    if(errors) return(
        <small className="text-destructive">
            {errors}
        </small>
    );
}