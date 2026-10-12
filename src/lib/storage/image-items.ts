import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ImageItem =
    | {id: string; kind: "existing"; url: string; preview: string; deleted: boolean}
    | {id: string; kind: "new"; file: File; preview: string}
    | {id: string; kind: "url"; url: string; preview: string};

export type ManifestEntry =
    | {kind: "existing"; url: string}
    | {kind: "url"; url: string}
    | {kind: "new"};

export const createExistingItem = (url: string): ImageItem => ({
    id: crypto.randomUUID(),
    kind: "existing",
    url,
    preview: url,
    deleted: false
});

export const createNewItem = (file: File): ImageItem => ({
    id: crypto.randomUUID(),
    kind: "new",
    file,
    preview: URL.createObjectURL(file)
});

export const createUrlItem = (url: string): ImageItem => ({
    id: crypto.randomUUID(),
    kind: "url",
    url,
    preview: url
});

export const isActive = (item: ImageItem) => item.kind !== "existing" || !item.deleted;

export const checkImageLoads = (url: string, timeoutMs = 10_000) => new Promise<boolean>((resolve) => {
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    const timer = setTimeout(() => resolve(false), timeoutMs);
    img.onload = () => (clearTimeout(timer), resolve(true));
    img.onerror = () => (clearTimeout(timer), resolve(false));
    img.src = url;
});

export const revokePreview = (item: ImageItem) => {
    if(item.kind === "new") URL.revokeObjectURL(item.preview);
};

export const buildManifest = (items: ImageItem[]): ManifestEntry[] => items.filter(isActive).map((i): ManifestEntry => {
    switch(i.kind) {
        case "existing": return {kind: "existing", url: i.url};
        case "url": return {kind: "url", url: i.url};
        case "new": return {kind: "new"};
    }
});

export const dropActive = (items: ImageItem[]): ImageItem[] => items.flatMap((i): ImageItem[] => {
    if(!isActive(i)) return [i];
    if(i.kind === "existing") return [{...i, deleted: true}];
    revokePreview(i);
    return [];
});

export const useImageItems = (initialUrls: string[]) => {
    const [initial, setInitial] = useState(initialUrls);
    const [items, setItems] = useState<ImageItem[]>(() => initial.map(createExistingItem));

    const itemsRef = useRef(items);
    itemsRef.current = items;
    useEffect(() => () => itemsRef.current.forEach(revokePreview), []);

    const reset = useCallback((urls: string[]) => {
        itemsRef.current.forEach(revokePreview);
        setInitial(urls);
        setItems(urls.map(createExistingItem));
    }, []);

    const isDirty = useMemo(() => {
        const active = items.filter(isActive);
        return(
            active.length !== initial.length ||
            active.some((i, idx) => i.kind !== "existing" || i.url !== initial[idx])
        );
    }, [items, initial]);

    return {items, setItems, reset, isDirty};
}