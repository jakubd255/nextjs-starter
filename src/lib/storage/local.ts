import { mkdir, rm, stat, writeFile } from "fs/promises";
import { dirname } from "path";
import type { StorageProvider } from "./types";
import { lookup } from "mime-types";
import { DOWNLOAD_PREFIX, localUrl, pathnameOf, relFromUrl, resolveUploadPath, UPLOAD_KEY_PREFIX } from "./local-paths";

export const localStorageProvider: StorageProvider = {
    async upload(file, key) {
        const rel = key.slice(UPLOAD_KEY_PREFIX.length);
        const target = resolveUploadPath(rel);
        await mkdir(dirname(target), {recursive: true});
        await writeFile(target, new Uint8Array(await file.arrayBuffer()));
        return {url: localUrl(rel)};
    },
    async delete(url) {
        await rm(resolveUploadPath(relFromUrl(url)), {force: true}).catch(console.error);
    },
    async head(url) {
        try {
            const rel = relFromUrl(url);
            const info = await stat(resolveUploadPath(rel));
            return {size: info.size, contentType: lookup(rel) || undefined };
        } 
        catch {
            return null;
        }
    },
    owns(url) {
        return pathnameOf(url)?.startsWith(DOWNLOAD_PREFIX) ?? false;
    }
}