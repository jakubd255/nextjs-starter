import z from "zod";

type ParseResult<T> = | {
    success: true;
    errors: undefined;
    data: T;
    rawData: Record<string, any>;
} | {
    success: false;
    errors: Record<string, string[] | undefined>;
    data: null;
    rawData: Record<string, any>;
};

export function parseFormData<T>(schema: z.ZodSchema<T>, formData: FormData): ParseResult<T> {
    const rawData = Object.fromEntries(formData.entries());
    const parsed = schema.safeParse(rawData);

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
            data: null as null,
            rawData
        };
    }

    return {
        success: true,
        errors: undefined,
        data: parsed.data,
        rawData
    };
}