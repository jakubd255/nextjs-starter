"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { StoredFile } from "./manifest";
import { FilePolicy, MB, shouldUploadDirect, validateFiles, validateUrl } from "./policy";
import { 
    checkUrlLoads, createDirectItem, createExistingItem, createNewItem, 
    createUrlItem, DirectItem, FileItem, isActive, reducer, revokePreview 
} from "./items";
import { uploadDirect } from "./direct-upload";
import discardUploadAction from "./discard-upload";

interface Options {
    scope?: string;
    disabled?: boolean;
    onDiscard?: (url: string) => Promise<unknown>;
}

export default function useFileInput(
    initialFiles: StoredFile[], 
    policy: FilePolicy, 
    {scope, disabled = false, onDiscard = discardUploadAction}: Options = {}
) {
    const [saved, setSaved] = useState(initialFiles);
    const [items, dispatch] = useReducer(reducer, initialFiles, (f) => f.map(createExistingItem));
    const [error, setError] = useState<string | null>(null);

    const latest = useRef(items);
    const uploads = useRef(new Map<string, AbortController>());

    useEffect(() => {
        latest.current = items;
    });

    useEffect(() => {
        const map = uploads.current;
        return () => {
            map.forEach((c) => c.abort());
            latest.current.forEach(revokePreview);
        }
    }, []);

    const single = policy.maxFiles === 1;
    const active = items.filter(isActive);
    const canAdd = !disabled && (single || active.length < policy.maxFiles);
    const limitError = `You can add up to ${policy.maxFiles} files`;

    const release = (list: FileItem[]) => list.forEach((i) => {
        uploads.current.get(i.id)?.abort();
        uploads.current.delete(i.id);
        revokePreview(i);
        if(i.kind === "direct" && i.status === "done" && i.url) void onDiscard(i.url);
    });

    const startUpload = (item: DirectItem) => {
        const patch = (change: Partial<DirectItem>) => dispatch({type: "patch", id: item.id, change});
        if(!scope) return patch({status: "error", error: "Missing upload scope"});

        const controller = new AbortController();
        uploads.current.set(item.id, controller);
        patch({status: "uploading", progress: 0, error: undefined});

        let last = -1;
        uploadDirect({
            file: item.file, policy, scope, signal: controller.signal,
            onProgress: (p) => {
                const rounded = Math.round(p);
                if(rounded !== last) { 
                    last = rounded; 
                    patch({progress: rounded});
                }
            }
        })
        .then((url) => patch({
            status: "done", 
            progress: 100, 
            url
        }))
        .catch((e: Error) => { 
            if(e.name !== "AbortError") patch({status: "error", error: e.message});
        })
        .finally(() => uploads.current.delete(item.id));
    }

    const addFiles = (files: File[]) => {
        const incoming = single ? files.slice(0, 1) : files;
        if(!incoming.length) return;
        if(!single && active.length + incoming.length > policy.maxFiles) return setError(limitError);

        const direct = incoming.filter((f) => shouldUploadDirect(policy, f));
        const viaAction = incoming.filter((f) => !direct.includes(f));
        const queued = single ? [] : items.flatMap((i) => (i.kind === "new" ? [i.file] : []));
        const message =
            validateFiles([...queued, ...viaAction], policy) ??
            validateFiles(direct, {...policy, maxTotalSize: undefined});
        if(message) return setError(message);

        setError(null);
        const created = incoming.map((f) => (direct.includes(f) ? createDirectItem(f) : createNewItem(f)));
        if(single) release(active);
        dispatch({type: "add", items: created, replace: single});
        for(const i of created) if(i.kind === "direct") startUpload(i);
    }

    const addUrl = async (raw: string): Promise<string | null> => {
        const url = raw.trim();
        const problem =
            validateUrl(url) ??
            (!single && active.length >= policy.maxFiles ? limitError : null) ??
            (active.some((i) => i.kind !== "new" && i.url === url) ? "This file is already on the list" : null) ??
            ((await checkUrlLoads(url, policy.media)) ? null : "Could not load a file from this URL");
        if(problem) return problem;

        setError(null);
        if(single) release(latest.current.filter(isActive));
        dispatch({type: "add", items: [createUrlItem(url)], replace: single});
        return null;
    }

    const remove = (item: FileItem) => {
        release([item]);
        setError(null);
        dispatch({type: "remove", id: item.id});
    }

    const restore = (item: FileItem) => {
        if(single) release(active);
        dispatch({type: "restore", id: item.id, replace: single});
    }

    const move = (index: number, dir: -1 | 1) => dispatch({type: "move", index, dir});

    const reset = useCallback((files: StoredFile[]) => {
        uploads.current.forEach((c) => c.abort());
        uploads.current.clear();
        latest.current.forEach(revokePreview);
        setSaved(files);
        setError(null);
        dispatch({ type: "reset", items: files.map(createExistingItem) });
    }, []);

    const directItems = items.filter((i): i is DirectItem => i.kind === "direct");
    const isBusy = directItems.some((i) => i.status === "uploading");
    const hasErrors = directItems.some((i) => i.status === "error");
    const isDirty =
        active.length !== saved.length ||
        active.some((i, idx) => i.kind !== "existing" || i.url !== saved[idx]?.url);

    return {
        policy, items, error, single, canAdd, activeCount: active.length, isDirty, isBusy, hasErrors,
        canSubmit: isDirty && !isBusy && !hasErrors,
        addFiles, addUrl, remove, restore, move, retry: startUpload, reset,
        source: {policy, multiple: !single, onFiles: addFiles, onUrl: addUrl}
    }
}

export type FileInput = ReturnType<typeof useFileInput>;