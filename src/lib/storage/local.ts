import { mkdir, rm, stat, writeFile } from "fs/promises";
import { dirname, join, resolve, sep } from "path";
import type { StorageProvider } from "./types";
import { lookup } from "mime-types";

const uploadDir = join(process.cwd(), "uploads");

const DOWNLOAD_PREFIX = "/api/download/";

export const localUrl = (rel: string) => `${DOWNLOAD_PREFIX}${rel.split("/").map(encodeURIComponent).join("/")}`;

export const resolveUploadPath = (rel: string) => {
    const full = resolve(uploadDir, rel);
    if(!full.startsWith(uploadDir + sep)) throw new Error("Invalid path");
    return full;
}

const relFromUrl = (url: string) => decodeURIComponent((pathnameOf(url) ?? "").slice(DOWNLOAD_PREFIX.length));

const pathnameOf = (url: string): string | null => {
    try {
        const u = new URL(url, "http://local");
        if(u.origin !== "http://local") {
            const site = process.env.NEXT_PUBLIC_SITE_URL;
            if (!site || u.origin !== new URL(site).origin) return null;
        }
        return u.pathname;
    } 
    catch {
        return null;
    }
}

export const localStorageProvider: StorageProvider = {
    async upload(file, key) {
        const rel = key.slice("uploads/".length);
        const target = resolveUploadPath(rel);
        await mkdir(dirname(target), {recursive: true});
        await writeFile(target, new Uint8Array(await file.arrayBuffer()));
        return {url: localUrl(rel)};
    },
    async delete(url) {
        console.log(url);
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