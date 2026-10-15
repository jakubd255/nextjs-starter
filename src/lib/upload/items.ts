import { ManifestItem, StoredFile } from "./manifest";
import { fileNameFromUrl } from "./names";
import { FilePolicy } from "./policy";

export type Media = FilePolicy["media"];

type Base = {
    id: string; 
    name: string; 
    preview: string;
}

export type DirectItem = Base & {
    kind: "direct";
    file: File;
    status: "uploading" | "done" | "error";
    progress: number;
    url?: string;
    error?: string;
}

export type FileItem =
    | (Base & {kind: "existing"; url: string; deleted: boolean})
    | (Base & {kind: "new"; file: File})
    | (Base & {kind: "url"; url: string})
    | DirectItem;

const base = (name: string, preview: string): Base => ({id: crypto.randomUUID(), name, preview});

export const createExistingItem = (f: StoredFile): FileItem => ({
    ...base(f.name, f.url), 
    kind: "existing", 
    url: f.url, 
    deleted: false
});

export const createNewItem = (file: File): FileItem => ({
    ...base(file.name, URL.createObjectURL(file)), 
    kind: "new", 
    file
});

export const createUrlItem = (url: string): FileItem => ({
    ...base(fileNameFromUrl(url), url), 
    kind: "url", 
    url
});

export const createDirectItem = (file: File): DirectItem => ({
    ...base(file.name, URL.createObjectURL(file)), 
    kind: "direct", 
    file, 
    status: "uploading", 
    progress: 0
});

export const isActive = (i: FileItem) => i.kind !== "existing" || !i.deleted;

export const revokePreview = (i: FileItem) => {
    if("file" in i) URL.revokeObjectURL(i.preview)
}

const toManifest: {[K in FileItem["kind"]]: (i: Extract<FileItem, {kind: K}>) => ManifestItem[]} = {
    existing: (i) => [{kind: "existing", url: i.url}],
    url: (i) => [{kind: "url", url: i.url}],
    new: () => [{kind: "new"}],
    direct: (i) => (i.status === "done" && i.url ? [{kind: "uploaded", url: i.url, name: i.name}] : [])
}

export const buildManifest = (items: FileItem[]): ManifestItem[] =>
    items.filter(isActive).flatMap((i) => (toManifest[i.kind] as (i: FileItem) => ManifestItem[])(i));

const EXT: [Media, RegExp][] = [["image", /\.(png|jpe?g|webp|gif|avif)$/], ["video", /\.(mp4|webm|mov)$/]];

export const resolveMedia = (item: FileItem, policy: FilePolicy): Media => {
    if(policy.media !== "file") return policy.media;
    const type = "file" in item ? item.file.type : "";
    return(
        (["image", "video"] as const).find((m) => type.startsWith(`${m}/`)) ??
        EXT.find(([, re]) => re.test(item.name.toLowerCase()))?.[0] ??
        "file"
    );
};

export const checkUrlLoads = (url: string, media: Media, timeoutMs = 10_000) => new Promise<boolean>((resolve) => {
    if(media === "file") return resolve(true);
    const el = media === "image" ? new Image() : document.createElement("video");
    const timer = setTimeout(() => resolve(false), timeoutMs);

    const done = (ok: boolean) => { 
        clearTimeout(timer); 
        resolve(ok);
    }

    el.onerror = () => done(false);
    if(el instanceof HTMLImageElement) {
        el.referrerPolicy = "no-referrer";
        el.onload = () => done(true);
    } 
    else {
        el.preload = "metadata";
        el.onloadedmetadata = () => done(true);
    }
    el.src = url;
});

export const itemName = (item: FileItem): string => {
    switch(item.kind) {
        case "new":
        case "direct": return item.file.name;
        case "existing": return item.name;
        case "url": {
            try {
                return decodeURIComponent(new URL(item.url).pathname.split("/").pop() || item.url);
            } 
            catch {
                return item.url;
            }
        }
    }
}

export type Action =
    | {type: "add"; items: FileItem[]; replace: boolean}
    | {type: "patch"; id: string; change: Partial<DirectItem>}
    | {type: "remove"; id: string }
    | {type: "restore"; id: string; replace: boolean}
    | {type: "move"; index: number; dir: -1 | 1}
    | {type: "reset"; items: FileItem[]};

const dropActive = (items: FileItem[]): FileItem[] =>
    items.flatMap((i): FileItem[] => (!isActive(i) ? [i] : i.kind === "existing" ? [{...i, deleted: true}] : []));

const handlers: {[T in Action["type"]]: (s: FileItem[], a: Extract<Action, {type: T}>) => FileItem[]} = {
    add: (s, {items, replace}) => {
        return [...(replace ? dropActive(s) : s), ...items]
    },
    patch: (s, {id, change}) => {
        return s.map((i) => (i.id === id && i.kind === "direct" ? {...i, ...change} : i))
    },
    remove: (s, {id}) => {
        return s.flatMap((i): FileItem[] => (i.id !== id ? [i] : i.kind === "existing" ? [{...i, deleted: true}] : []))
    },
    restore: (s, {id, replace}) => {
        return (replace ? dropActive(s) : s).map((i) => (i.id === id && i.kind === "existing" ? {...i, deleted: false} : i))
    },
    move: (s, {index, dir}) => {
        const t = index + dir;
        if(t < 0 || t >= s.length) return s;
        const copy = [...s];
        [copy[index], copy[t]] = [copy[t], copy[index]];
        return copy;
    },
    reset: (_, {items}) => items
};

export const reducer = (s: FileItem[], a: Action) =>
    (handlers[a.type] as (s: FileItem[], a: Action) => FileItem[])(s, a);