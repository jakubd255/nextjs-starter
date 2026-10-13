import { ManifestItem, StoredFile } from "./manifest";
import { FilePolicy } from "./policy";

export type FileItem =
    | {id: string; kind: "existing"; url: string; name: string; preview: string; deleted: boolean}
    | {id: string; kind: "new"; file: File; name: string; preview: string}
    | {id: string; kind: "url"; url: string; name: string; preview: string};

export const createExistingItem = (f: StoredFile): FileItem => ({
    id: crypto.randomUUID(),
    kind: "existing",
    url: f.url,
    name: f.name,
    preview: f.url,
    deleted: false
});

export const createNewItem = (file: File): FileItem => ({
    id: crypto.randomUUID(),
    kind: "new",
    file,
    name: file.name,
    preview: URL.createObjectURL(file)
});

export const createUrlItem = (url: string): FileItem => ({
    id: crypto.randomUUID(),
    kind: "url",
    url,
    name: decodeURIComponent(new URL(url).pathname.split("/").pop() || url),
    preview: url
});

export const isActive = (item: FileItem) => item.kind !== "existing" || !item.deleted;

export const checkImageLoads = (url: string, timeoutMs = 10_000) => new Promise<boolean>((resolve) => {
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    const timer = setTimeout(() => resolve(false), timeoutMs);
    img.onload = () => (clearTimeout(timer), resolve(true));
    img.onerror = () => (clearTimeout(timer), resolve(false));
    img.src = url;
});

export const revokePreview = (item: FileItem) => {
    if(item.kind === "new") URL.revokeObjectURL(item.preview);
};

export const dropActive = (items: FileItem[]): FileItem[] => items.flatMap((i): FileItem[] => {
    if(!isActive(i)) return [i];
    if(i.kind === "existing") return [{...i, deleted: true}];
    revokePreview(i);
    return [];
});

export const buildManifest = (items: FileItem[]): ManifestItem[] => items.filter(isActive).map((i): ManifestItem => {
    switch(i.kind) {
        case "existing": return {kind: "existing", url: i.url};
        case "url": return {kind: "url", url: i.url};
        case "new": return {kind: "new"};
    }
});

export const moveItem = (items: FileItem[], index: number, dir: -1 | 1): FileItem[] => {
    const target = index + dir;
    if(target < 0 || target >= items.length) return items;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    return copy;
};

export const removeItem = (items: FileItem[], item: FileItem): FileItem[] => {
    if(item.kind === "existing") return items.map((i) => (i.id === item.id ? {...i, deleted: true} : i));
    revokePreview(item);
    return items.filter((i) => i.id !== item.id);
};

export const restoreItem = (items: FileItem[], item: FileItem): FileItem[] =>
    items.map((i) => (i.id === item.id && i.kind === "existing" ? {...i, deleted: false} : i));

export const itemName = (item: FileItem): string => {
    if(item.kind === "new") return item.file.name;
    try {
        return decodeURIComponent(new URL(item.url).pathname.split("/").pop() || item.url);
    } 
    catch {
        return item.url;
    }
};

export type Media = FilePolicy["media"];

export const resolveMedia = (item: FileItem, policy: FilePolicy): Media => {
    if(policy.media !== "file") return policy.media;
    if(item.kind === "new") {
        if(item.file.type.startsWith("image/")) return "image";
        if(item.file.type.startsWith("video/")) return "video";
        return "file";
    }
    const name = itemName(item).toLowerCase();
    if(/\.(png|jpe?g|webp|gif|avif)$/.test(name)) return "image";
    if(/\.(mp4|webm|mov)$/.test(name)) return "video";
    return "file";
};

export const checkUrlLoads = (url: string, media: Media, timeoutMs = 10_000) => new Promise<boolean>((resolve) => {
    if(media === "file") return resolve(true);
    const el = media === "image" ? new Image() : document.createElement("video");
    const done = (ok: boolean) => { 
        clearTimeout(timer); 
        resolve(ok); 
    }
    const timer = setTimeout(() => resolve(false), timeoutMs);

    if(el instanceof HTMLImageElement) {
        el.referrerPolicy = "no-referrer";
        el.onload = () => done(true);
        el.onerror = () => done(false);
    }
    else {
        el.preload = "metadata";
        el.onloadedmetadata = () => done(true);
        el.onerror = () => done(false);
    }
    el.src = url;
});