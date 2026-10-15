import { put, del, head } from "@vercel/blob";
import type { StorageProvider } from "./types";

export const vercelBlobProvider: StorageProvider = {
    async upload(file, key) {
        const blob = await put(key, file, {
            access: "public",
            addRandomSuffix: false,
            allowOverwrite: false,
            contentType: file.type,
        });
        return {url: blob.url}
    },
    async delete(url) {
        await del(url).catch(console.error);
    },
    async head(url) {
        const meta = await head(url).catch(() => null);
        return meta ? {size: meta.size, contentType: meta.contentType} : null;
    },
    owns(url) {
        return url.includes(".public.blob.vercel-storage.com");
    }
}