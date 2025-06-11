export interface ActionResult {
    success: boolean;
    errors?: Record<string, string[]>;
    [key: string]: any;
}