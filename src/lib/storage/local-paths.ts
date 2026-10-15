import { join, resolve, sep } from "path";


export const UPLOAD_KEY_PREFIX = "uploads/";
export const DOWNLOAD_PREFIX = "/api/download/";

const uploadDir = join(process.cwd(), "uploads");

export const localUrl = (rel: string) => `${DOWNLOAD_PREFIX}${rel.split("/").map(encodeURIComponent).join("/")}`;

export const resolveUploadPath = (rel: string) => {
    const full = resolve(uploadDir, rel);
    if(!full.startsWith(uploadDir + sep)) throw new Error("Invalid path");
    return full;
}

export const relFromUrl = (url: string) => decodeURIComponent((pathnameOf(url) ?? "").slice(DOWNLOAD_PREFIX.length));

export const pathnameOf = (url: string): string | null => {
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