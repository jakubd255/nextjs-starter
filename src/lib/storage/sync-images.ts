import "server-only";
import { IMAGE_RULES, validateImage, validateImageUrl } from "@/lib/storage/validate";
import { storage } from ".";

type ManifestItem =
    | {kind: "existing"; url: string}
    | {kind: "url"; url: string}
    | {kind: "new"};

export type SyncImagesResult =
    | {ok: true; images: string[]}
    | {ok: false; message: string};

type SyncImagesOptions = {
    data: FormData;
    current: string[];
    maxFiles?: number;
    persist: (images: string[]) => Promise<void>;
};

function parseManifest(raw: FormDataEntryValue | null): ManifestItem[] | null {
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

const fail = (message: string): SyncImagesResult => ({ ok: false, message });

export async function syncImages({data, current, maxFiles = IMAGE_RULES.maxFiles, persist}: SyncImagesOptions): Promise<SyncImagesResult> {
    const manifest = parseManifest(data.get("manifest"));
    if(!manifest) return fail("Invalid image list");

    const files = data.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    const newCount = manifest.filter((m) => m.kind === "new").length;

    if(newCount !== files.length || manifest.length > maxFiles) return fail("Invalid image list");

    for(const file of files) {
        const error = validateImage(file);
        if (error) return fail(error);
    }

    if(manifest.some((m) => m.kind === "existing" && !current.includes(m.url))) {
        return fail("Invalid image list");
    }
    if(manifest.some((m) => m.kind === "url" && validateImageUrl(m.url))) {
        return fail("Invalid image URL");
    }

    const results = await Promise.allSettled(files.map((f) => storage.upload(f)));
    const uploaded = results.flatMap((r) => (r.status === "fulfilled" ? [r.value.url] : []));

    if(uploaded.length !== files.length) {
        await Promise.allSettled(uploaded.map((u) => storage.delete(u)));
        return fail("Upload failed");
    }

    let next = 0;
    const images = manifest.map((m) => (m.kind === "new" ? uploaded[next++] : m.url));

    try {
        await persist(images);
    } 
    catch(error) {
        console.error(error);
        await Promise.allSettled(uploaded.map((u) => storage.delete(u)));
        return fail("Save failed");
    }

    const removed = current.filter((u) => !images.includes(u) && storage.owns(u));
    await Promise.allSettled(removed.map((u) => storage.delete(u)));

    return {ok: true, images}
}