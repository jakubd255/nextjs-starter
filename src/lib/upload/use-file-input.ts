"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StoredFile } from "./manifest";
import { FilePolicy, MB, validateFiles, validateUrl } from "./policy";
import { 
    buildManifest, checkUrlLoads, createDirectItem, createExistingItem, 
    createNewItem, createUrlItem, DirectItem, dropActive, 
    FileItem, isActive, moveItem, 
    removeItem, restoreItem, revokePreview 
} from "./file-items";
import { uploadDirect } from "./direct-upload";

interface Options {
    scope?: string;
}

export default function useFileInput(initialFiles: StoredFile[], policy: FilePolicy, {scope}: Options = {}, disabled = false) {
    const [saved, setSaved] = useState(initialFiles);
    const [items, setItemsState] = useState<FileItem[]>(() => initialFiles.map(createExistingItem));
    const [error, setError] = useState<string | null>(null);

    const ref = useRef(items);
    const uploads = useRef(new Map<string, AbortController>());

    const setItems = (next: FileItem[]) => {
        ref.current = next;
        setItemsState(next);
    };

    const abort = (list: FileItem[]) => list.forEach((i) => {
        uploads.current.get(i.id)?.abort();
        uploads.current.delete(i.id);
    });
    
    useEffect(() => () => {
        uploads.current.forEach((c) => c.abort());
        ref.current.forEach(revokePreview);
    }, []);

    const single = policy.maxFiles === 1;
    const activeCount = items.filter(isActive).length;
    const canAdd = !disabled && (single || activeCount < policy.maxFiles);

    const replaceActive = () => {
        if(!single) return ref.current;
        abort(ref.current.filter(isActive));
        return dropActive(ref.current);
    }

    const viaDirect = (f: File) => policy.transport === "direct" || (policy.transport === "auto" && f.size > (policy.directThreshold ?? 4 * MB));

    const patch = (id: string, change: Partial<DirectItem>) => setItems(ref.current.map((i) => (i.id === id && i.kind === "direct" ? {...i, ...change} : i)));

    const startUpload = (item: DirectItem) => {
        if(!scope) {
            return patch(item.id, {status: "error", error: "Missing upload scope"});
        }
        const controller = new AbortController();
        uploads.current.set(item.id, controller);
        patch(item.id, {status: "uploading", progress: 0, error: undefined});

        uploadDirect({
            file: item.file, policy, scope, signal: controller.signal,
            onProgress: (percent) => {
                const current = ref.current.find((i) => i.id === item.id);
                const rounded = Math.round(percent);
                if(current?.kind === "direct" && current.progress !== rounded) patch(item.id, { progress: rounded });
            }
        })
            .then((url) => patch(item.id, {status: "done", progress: 100, url}))
            .catch((e: Error) => {
                if(e.name !== "AbortError") patch(item.id, {status: "error", error: e.message});
            })
            .finally(() => uploads.current.delete(item.id));
    }

    const base = () => (single ? dropActive(ref.current) : ref.current);

    const addFiles = (files: File[]) => {
        const incoming = single ? files.slice(0, 1) : files;
        if(incoming.length === 0) return;
        if(!single && ref.current.filter(isActive).length + incoming.length > policy.maxFiles) {
            return setError(`You can add up to ${policy.maxFiles} files`);
        }

        const queued = single ? [] : ref.current.flatMap((i) => (i.kind === "new" ? [i.file] : []));
        const message =
            validateFiles([...queued, ...incoming.filter((f) => !viaDirect(f))], policy) ??
            validateFiles(incoming.filter(viaDirect), {...policy, maxTotalSize: undefined});
        if(message) return setError(message);

        setError(null);
        const created = incoming.map((f) => (viaDirect(f) ? createDirectItem(f) : createNewItem(f)));
        setItems([...replaceActive(), ...created]);
        created.forEach((i) => i.kind === "direct" && startUpload(i));
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

    const remove = (item: FileItem) => {
        abort([item]);
        setError(null); 
        setItems(removeItem(ref.current, item));
    }

    const restore = (item: FileItem) => setItems(restoreItem(single ? dropActive(ref.current) : ref.current, item));
    const move = (index: number, dir: -1 | 1) => setItems(moveItem(ref.current, index, dir));
    const retry = (item: DirectItem) => startUpload(item);

    const reset = useCallback((files: StoredFile[]) => {
        abort(ref.current);
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

    const isBusy = items.some((i) => i.kind === "direct" && i.status === "uploading");
    const hasErrors = items.some((i) => i.kind === "direct" && i.status === "error");

    return {
        policy, items, error, single, canAdd, activeCount, isDirty, isBusy, hasErrors,
        canSubmit: isDirty && !isBusy && !hasErrors,
        addFiles, addUrl, remove, restore, move, retry, reset,
        source: {policy, multiple: !single, onFiles: addFiles, onUrl: addUrl},
    }
}

export type FileInput = ReturnType<typeof useFileInput>;