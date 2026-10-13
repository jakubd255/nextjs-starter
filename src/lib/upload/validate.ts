export const IMAGE_RULES = {
    maxFiles: 10,
    maxSize: 1.5 * 1024 * 1024,
    types: ["image/png", "image/jpeg", "image/webp"]
} as const;

export const validateImage = (file: File): string | null => {
    if(!IMAGE_RULES.types.includes(file.type as never)) return "Unsupported file type";
    if(file.size > IMAGE_RULES.maxSize) return "File too large";
    return null;
}

export const MAX_URL_LENGTH = 2048;

export const validateImageUrl = (raw: string): string | null => {
    if(raw.length > MAX_URL_LENGTH) return "URL is too long";
    try {
        const url = new URL(raw);
        if(url.protocol !== "https:") return "Only https:// URLs are allowed";
    }
    catch {
        return "Invalid URL";
    }
    return null;
}