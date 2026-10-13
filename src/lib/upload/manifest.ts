export type StoredFile = {url: string; name: string};

export type ManifestItem =
    | {kind: "existing"; url: string}
    | {kind: "url"; url: string}
    | {kind: "new"};

export const parseManifest = (raw: FormDataEntryValue | null): ManifestItem[] | null => {
    try {
        const parsed = JSON.parse(String(raw));
        if(!Array.isArray(parsed)) return null;
        const valid = parsed.every((i) => i?.kind === "new" || ((i?.kind === "existing" || i?.kind === "url") && typeof i.url === "string"));
        return valid ? parsed : null;
    } 
    catch {
        return null;
    }
}