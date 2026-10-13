"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StoredFile } from "./manifest";
import { FilePolicy, validateFiles, validateUrl } from "./policy";
import { buildManifest, checkUrlLoads, createExistingItem, createNewItem, createUrlItem, dropActive, FileItem, isActive, moveItem, removeItem, restoreItem, revokePreview } from "./file-items";

export default function useFileInput(initialFiles: StoredFile[], policy: FilePolicy, disabled = false) {
    const [saved, setSaved] = useState(initialFiles);
    const [items, setItemsState] = useState<FileItem[]>(() => initialFiles.map(createExistingItem));
    const [error, setError] = useState<string | null>(null);

    const ref = useRef(items);
    const setItems = (next: FileItem[]) => {
        ref.current = next;
        setItemsState(next);
    };
    
    useEffect(() => () => ref.current.forEach(revokePreview), []);

    const single = policy.maxFiles === 1;
    const activeCount = items.filter(isActive).length;
    const canAdd = !disabled && (single || activeCount < policy.maxFiles);
    const base = () => (single ? dropActive(ref.current) : ref.current);

    const addFiles = (files: File[]) => {
        const incoming = single ? files.slice(0, 1) : files;
        if(incoming.length === 0) return;
        if(!single && ref.current.filter(isActive).length + incoming.length > policy.maxFiles) {
            return setError(`You can add up to ${policy.maxFiles} files`);
        }
        const already = single ? [] : ref.current.flatMap((i) => (i.kind === "new" ? [i.file] : []));
        const message = validateFiles([...already, ...incoming], policy);
        if (message) return setError(message);

        setError(null);
        setItems([...base(), ...incoming.map(createNewItem)]);
    }

    const addUrl = async (raw: string): Promise<string | null> => {
        const url = raw.trim();
        const invalid = validateUrl(url);
        if(invalid) return invalid;
        if(!single && ref.current.filter(isActive).length >= policy.maxFiles) {
            return `You can add up to ${policy.maxFiles} files`;
        }
        if(ref.current.some((i) => isActive(i) && i.kind !== "new" && i.url === url)) {
            return "This file is already on the list";
        }
        if(!(await checkUrlLoads(url, policy.media))) return "Could not load a file from this URL";

        setError(null);
        setItems([...base(), createUrlItem(url)]);
        return null;
    }

    const remove = (item: FileItem) => { setError(null); setItems(removeItem(ref.current, item)); };
    const restore = (item: FileItem) => setItems(restoreItem(single ? dropActive(ref.current) : ref.current, item));
    const move = (index: number, dir: -1 | 1) => setItems(moveItem(ref.current, index, dir));

    const reset = useCallback((files: StoredFile[]) => {
        ref.current.forEach(revokePreview);
        setSaved(files);
        const next = files.map(createExistingItem);
        ref.current = next;
        setItemsState(next);
        setError(null);
    }, []);

    const isDirty = useMemo(() => {
        const active = items.filter(isActive);
        return active.length !== saved.length || active.some((i, idx) => i.kind !== "existing" || i.url !== saved[idx]?.url);
    }, [items, saved]);

    return {
        policy, 
        items, 
        error, 
        single, 
        canAdd, 
        activeCount, 
        disabled, 
        isDirty,
        addFiles, 
        addUrl, 
        remove, 
        restore, 
        move, 
        reset,
        source: {
            policy, 
            multiple: !single, 
            onFiles: addFiles, 
            onUrl: addUrl
        },
        manifest: JSON.stringify(buildManifest(items))
    }
}

export type FileInput = ReturnType<typeof useFileInput>;