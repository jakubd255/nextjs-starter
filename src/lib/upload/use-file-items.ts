import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createExistingItem, FileItem, isActive, revokePreview } from "./file-items";
import { StoredFile } from "./manifest";

export const useFileItems = (initialFiles: StoredFile[]) => {
    const [initial, setInitial] = useState(initialFiles);
    const [items, setItems] = useState<FileItem[]>(() => initial.map(createExistingItem));

    const itemsRef = useRef(items);
    itemsRef.current = items;
    useEffect(() => () => itemsRef.current.forEach(revokePreview), []);

    const reset = useCallback((files?: StoredFile[]) => {
        if(!Array.isArray(files)) {
            console.error("reset() expects StoredFile[]", files);
            return;
        }
        itemsRef.current.forEach(revokePreview);
        setInitial(files);
        setItems(files.map(createExistingItem));
    }, []);

    const isDirty = useMemo(() => {
        const active = items.filter(isActive);
        return (
            active.length !== initial.length ||
            active.some((i, idx) => i.kind !== "existing" || i.url !== initial[idx]?.url)
        );
    }, [items, initial]);

    return {items, setItems, reset, isDirty};
}