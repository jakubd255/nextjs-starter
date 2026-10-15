import { z } from "zod";
import { MAX_URL_LENGTH } from "./policy";

const url = z.string().max(MAX_URL_LENGTH);
 
const manifestSchema = z.array(z.discriminatedUnion("kind", [
    z.object({kind: z.literal("existing"), url}),
    z.object({kind: z.literal("url"), url}),
    z.object({kind: z.literal("new")}),
    z.object({kind: z.literal("uploaded"), url, name: z.string().max(1000)})
]));

export type ManifestItem = z.infer<typeof manifestSchema>[number];
export type StoredFile = {url: string; name: string};

export const parseManifest = (raw: FormDataEntryValue | null): ManifestItem[] | null => {
    try {
        const result = manifestSchema.safeParse(JSON.parse(String(raw)));
        return result.success ? result.data : null;
    } 
    catch {
        return null;
    }
}