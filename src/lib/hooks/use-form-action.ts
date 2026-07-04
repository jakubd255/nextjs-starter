import { useActionState } from "react";
import { toast } from "sonner";
import { handleActionResult } from "../utils/action-result";

interface ServerActionResponse {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

export function useFormAction<ActionResponse extends ServerActionResponse>(
    actionFn: (prevState: any, formData: FormData) => Promise<ActionResponse>,
    options?: {
        onSuccess?: (result: ActionResponse) => void;
        onError?: (result: ActionResponse) => void;
    }
) {
    return useActionState(async (prevState: any, formData: FormData) => {
        try {
            const result = await actionFn(prevState, formData);

            handleActionResult(result);

            if(result.success) {
                options?.onSuccess?.(result);
            } 
            else {
                options?.onError?.(result);
            }

            return result;
        } 
        catch(error) {
            console.error("Form action error:", error);
            toast.error("An unexpected connection error occurred.");
            
            return {
                success: false,
                message: "Server connection error.",
                errors: {},
            } as unknown as ActionResponse;
        }
    }, undefined);
}