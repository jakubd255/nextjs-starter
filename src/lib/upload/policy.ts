export type FilePolicy = {
    accept: readonly string[];
    block?: readonly string[];
    maxFiles: number;
    maxSize: number;
    maxTotalSize?: number;
    media: "image" | "video" | "file";
    key?: string;
    transport?: "action" | "direct" | "auto";
    directThreshold?: number; 
}

const BLOCKED = [".html", ".htm", ".svg", ".js", ".exe", ".bat", ".sh", "text/html", "image/svg+xml"];

export const MB = 1024 * 1024;

export const FILE_POLICIES = {
    images: {
        accept: ["image/png", "image/jpeg", "image/webp"], 
        maxFiles: 10, 
        maxSize: 10 * MB, 
        media: "image",
        key: "images",
        transport: "action",
    },
    videos: {
        accept: ["video/mp4", "video/webm"], 
        maxFiles: 3, 
        maxSize: 1024 * MB, 
        media: "video",
        key: "videos",
        transport: "direct",
    },
    any: {
        accept: ["*"], 
        block: BLOCKED, 
        maxFiles: 10, 
        maxSize: 1024 * MB, 
        media: "file",
        key: "any", 
        transport: "auto", 
        directThreshold: 4 * MB
    }
} satisfies Record<string, FilePolicy>;

export const policyByKey = (key: string | null): FilePolicy | undefined => Object.values<FilePolicy>(FILE_POLICIES).find((p) => p.key === key);
export const acceptAttr = (policy: FilePolicy) => policy.accept.includes("*") ? undefined : policy.accept.join(",");
export const definePolicy = (base: FilePolicy, override: Partial<FilePolicy> = {}): FilePolicy => ({...base, ...override});

const matchesToken = (file: {name: string; type: string}, token: string) => {
    const t = token.toLowerCase();
    if(t === "*") return true;
    if(t.endsWith("/*")) return file.type.toLowerCase().startsWith(t.slice(0, -1));
    if(t.startsWith(".")) return file.name.toLowerCase().endsWith(t);
    return file.type.toLowerCase() === t;
}

export const matchesAccept = (file: {name: string; type: string}, policy: FilePolicy) => {
    if(policy.block?.some((t) => matchesToken(file, t))) return false;
    return policy.accept.some((t) => matchesToken(file, t));
}

export const validateFile = (file: File, policy: FilePolicy): string | null => {
    if(!matchesAccept(file, policy)) return "Unsupported file type";
    if(file.size > policy.maxSize) return "File too large";
    return null;
}

export const validateFiles = (files: File[], policy: FilePolicy): string | null => {
    for(const file of files) {
        const error = validateFile(file, policy);
        if(error) return `${file.name}: ${error}`;
    }
    if(policy.maxTotalSize && files.reduce((sum, f) => sum + f.size, 0) > policy.maxTotalSize) {
        return "Files are too large in total";
    }
    return null;
}

export const MAX_URL_LENGTH = 2048;

export const validateUrl = (raw: string): string | null => {
    if(raw.length > MAX_URL_LENGTH) return "URL is too long";
    try {
        if(new URL(raw).protocol !== "https:") return "Only https:// URLs are allowed";
    } 
    catch {
        return "Invalid URL";
    }
    return null;
}