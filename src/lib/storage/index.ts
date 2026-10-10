import type { StorageProvider } from "./types";
import { localStorageProvider } from "./local";
import { vercelBlobProvider } from "./vercel-blob";

const resolveProvider = (): StorageProvider => {
    switch (process.env.STORAGE_PROVIDER) {
        case "vercel-blob":
            return vercelBlobProvider;
        case "local":
            return localStorageProvider;
        default:
            return process.env.VERCEL ? vercelBlobProvider : localStorageProvider;
    }
}

export const storage = resolveProvider();
