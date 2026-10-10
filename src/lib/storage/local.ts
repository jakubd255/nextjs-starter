import { mkdir, unlink, writeFile } from "fs/promises";
import { extname, join, basename } from "path";
import { randomUUID } from "crypto";
import type { StorageProvider } from "./types";

const uploadDir = join(process.cwd(), "uploads");
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export const localStorageProvider: StorageProvider = {
    async upload(file) {
        await mkdir(uploadDir, {recursive: true});
        const key = randomUUID() + extname(file.name);
        await writeFile(join(uploadDir, key), new Uint8Array(await file.arrayBuffer()));
        return {url: `${baseUrl}/api/download/${key}`};
    },

    async delete(url) {
        const key = basename(new URL(url).pathname);
        await unlink(join(uploadDir, key)).catch(console.error);
    },
    owns(url) {
        return url.startsWith(`${baseUrl}/api/download/`);
    }
};