import "server-only";
import { storage } from "../storage";
import { parseManifest, StoredFile } from "./manifest";
import { FilePolicy, matchesAccept, validateFiles, validateUrl } from "./policy";
import { directKey, isOwnedBy, sanitizeFileName } from "./names";

export type SyncFilesResult =
    | {ok: true; files: StoredFile[]}
    | {ok: false; message: string};

interface Options {
    data: FormData;
    policy: FilePolicy;
    current: StoredFile[];
    persist: (images: StoredFile[]) => Promise<void>;
    manifestName?: string;
    filesName?: string;
    scope: string
}

const fail = (message: string): SyncFilesResult => ({ok: false, message});

const sanitizeName = (raw: string) =>
    raw.replace(/[\\/\u0000-\u001f]/g, "_").trim().slice(0, 255) || "file";

const nameFromUrl = (url: string) => {
    try {
        return sanitizeName(decodeURIComponent(new URL(url).pathname.split("/").pop() ?? ""));
    } 
    catch {
        return "file";
    }
}

export const syncFiles = async ({
    data, 
    policy,
    current, 
    persist,
    manifestName = "manifest", 
    filesName = "files",
    scope
}: Options): Promise<SyncFilesResult> => {
    const manifest = parseManifest(data.get(manifestName));
    if(!manifest) return fail("Invalid file list");

    const files = data.getAll(filesName).filter((f): f is File => f instanceof File && f.size > 0);
    const newCount = manifest.filter((m) => m.kind === "new").length;
    if(newCount !== files.length || manifest.length > policy.maxFiles) {
        return fail("Invalid file list");
    };

    const fileError = validateFiles(files, policy);
    if(fileError) return fail(fileError);

    const byUrl = new Map(current.map((f) => [f.url, f]));
    if(manifest.some((m) => m.kind === "existing" && !byUrl.has(m.url))) {
        return fail("Invalid file list");
    }

    if(manifest.some((m) => m.kind === "url" && (validateUrl(m.url) || storage.owns(m.url)))) {
        return fail("Invalid URL");
    }

    const urls = manifest.flatMap((m) => ("url" in m ? [m.url] : []));
    if(new Set(urls).size !== urls.length) {
        return fail("Invalid file list");
    }

    const direct = manifest.flatMap((m) => (m.kind === "uploaded" ? [m.url] : []));
    if (direct.length > 0) {
        if(!scope) return fail("Invalid file list");

        if(direct.some((u) => !storage.owns(u) || !isOwnedBy(u, scope))) return fail("Invalid file list");

        const metas = await Promise.all(direct.map((u) => storage.head(u)));
        const bad = direct.filter((u, i) => {
            const meta = metas[i];
            return !meta || meta.size > policy.maxSize
                || !matchesAccept({name: nameFromUrl(u), type: meta.contentType ?? ""}, policy);
        });
        if(bad.length > 0) {
            await Promise.allSettled(bad.map((u) => storage.delete(u)));
            return fail("Uploaded file is invalid");
        }
    }

    const results = await Promise.allSettled(
        files.map((f) => storage.upload(f, directKey(scope, f.name))),
    );

    const uploaded = results.flatMap((r) => (r.status === "fulfilled" ? [r.value.url] : []));
    if(uploaded.length !== files.length) {
        await Promise.allSettled(uploaded.map((u) => storage.delete(u)));
        return fail("Upload failed");
    }

    let next = 0;
    const finalFiles: StoredFile[] = manifest.map((m) => {
        if(m.kind === "new") {
            const i = next++;
            return {url: uploaded[i], name: sanitizeFileName(files[i].name)};
        }
        if(m.kind === "existing") return byUrl.get(m.url)!;
        if(m.kind === "uploaded") return { url: m.url, name: sanitizeFileName(m.name)};
        return {url: m.url, name: nameFromUrl(m.url)};
    });

    try {
        await persist(finalFiles);
    } 
    catch(error) {
        console.error(error);
        await Promise.allSettled(uploaded.map((u) => storage.delete(u)));
        return fail("Save failed");
    }

    const finalUrls = new Set(finalFiles.map((f) => f.url));
    const removed = current.filter((f) => !finalUrls.has(f.url) && storage.owns(f.url));
    await Promise.allSettled(removed.map((f) => storage.delete(f.url)));

    return {ok: true, files: finalFiles};
}