const clean = (raw: string, max: number) => raw.replace(/[\\/\u0000-\u001f]/g, "_").trim().slice(0, max) || "file";

export const sanitizeFileName = (raw: string) => clean(raw, 200);

export const fileNameFromUrl = (url: string) => {
    try {
        return sanitizeFileName(decodeURIComponent(new URL(url).pathname.split("/").pop() || "file"));
    } 
    catch {
        return "file";
    }
};

const extOf = (name: string) => /\.[A-Za-z0-9]{1,10}$/.exec(name)?.[0].toLowerCase() ?? "";

export const directKey = (scope: string, fileName: string) => `uploads/${scope}/${crypto.randomUUID()}${extOf(fileName)}`;

const FILE_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(\.[a-z0-9]{1,10})?$/;

export const isValidDirectKey = (key: string, scope: string) => {
    const [root, owner, base, ...rest] = key.split("/");
    return rest.length === 0 && root === "uploads" && owner === scope && FILE_RE.test(base ?? "");
};

export const isOwnedBy = (url: string, scope: string) => {
    try {
        const parts = new URL(url, "http://local").pathname.split("/").map(decodeURIComponent);
        return parts.length >= 2 && parts.at(-2) === scope && FILE_RE.test(parts.at(-1)!);
    } 
    catch {
        return false;
    }
};