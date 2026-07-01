import { toast } from "sonner";

export interface ActionResult {
    success: boolean;
    errors?: Record<string, string[]>;
    [key: string]: any;
}

export const actionSuccess = (value?: any): ActionResult => ({
    success: true, ...value
});

export const actionFailure = (errors: Record<string, string[]> = {}, state: any = {}): ActionResult => ({
    success: false, errors, ...state
});

export const handleActionResult = (result: ActionResult, successMessage: string) => {
    if(result.success) {
        toast.success(successMessage, {
            position: "top-center"
        });
        return true;
    }

    else if(result.errors?.permission) {
        toast.error(result.errors?.permission, {
            position: "top-center"
        });
    }

    return false;
};