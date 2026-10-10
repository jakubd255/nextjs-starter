import { put, del } from "@vercel/blob";
import { extname } from "path";
import { randomUUID } from "crypto";
import type { StorageProvider } from "./types";

export const vercelBlobProvider: StorageProvider = {
    async upload(file) {
        const key = `uploads/${randomUUID()}${extname(file.name)}`;
        const blob = await put(key, file, {access: "public"});
        return {
            key: blob.url, 
            url: blob.url
        };
    },
    async delete(key) {
        await del(key).catch(console.error);
    },
    owns(url) {
        return url.includes(".public.blob.vercel-storage.com");
    }
}