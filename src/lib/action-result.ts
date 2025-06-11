import { ActionResult } from "@/types";

export const actionSuccess = (value?: any): ActionResult => ({
    success: true, ...value
});

export const actionFailure = (errors: Record<string, string[]> = {}, state: any = {}): ActionResult => ({
    success: false, errors, ...state
});