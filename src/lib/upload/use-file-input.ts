"use client";

import { useRef, useState } from "react";
import {
    buildManifest, checkUrlLoads, createNewItem, createUrlItem, dropActive,
    isActive, moveItem, removeItem, restoreItem, FileItem
} from "./file-items";
import { validateFiles, validateUrl, FilePolicy } from "./policy";

export type FileItemRenderProps = {
    item: FileItem;
    index: number;
    total: number;
    deleted: boolean;
    disabled: boolean;
    canMoveBack: boolean;
    canMoveForward: boolean;
    move: (dir: -1 | 1) => void;
    remove: () => void;
    restore: () => void;
    reorderable?: boolean;
};

interface Options {
    value: FileItem[];
    onChange: (items: FileItem[]) => void;
    policy: FilePolicy;
    disabled?: boolean;
    manifestName?: string;
    filesName?: string;
};

export function useFileInput({
    value, 
    onChange, 
    policy, 
    disabled = false,
    manifestName = "manifest", 
    filesName = "files"
}: Options) {
    const latest = useRef(value);
    latest.current = value;

    const [error, setError] = useState<string | null>(null);

    const single = policy.maxFiles === 1;
    const activeCount = value.filter(isActive).length;
    const canAdd = !disabled && (single || activeCount < policy.maxFiles);

    const commit = (next: FileItem[]) => {
        latest.current = next;
        onChange(next);
    };
    const base = () => (single ? dropActive(latest.current) : latest.current);

    const addFiles = (files: File[]) => {
        if(files.length === 0) return;
        const incoming = single ? files.slice(0, 1) : files;
        const current = latest.current;

        if(!single && current.filter(isActive).length + incoming.length > policy.maxFiles) {
            return setError(`You can add up to ${policy.maxFiles} files`);
        }
        const already = single ? [] : current.flatMap((i) => (i.kind === "new" ? [i.file] : []));
        const message = validateFiles([...already, ...incoming], policy);
        if(message) return setError(message);

        setError(null);
        commit([...base(), ...incoming.map(createNewItem)]);
    };

    const addUrl = async (raw: string): Promise<string | null> => {
        const url = raw.trim();
        const invalid = validateUrl(url);
        if(invalid) return invalid;

        const current = latest.current;
        if(!single && current.filter(isActive).length >= policy.maxFiles) {
            return `You can add up to ${policy.maxFiles} files`;
        }
        if(current.some((i) => isActive(i) && i.kind !== "new" && i.url === url)) {
            return "This file is already on the list";
        }
        if(!(await checkUrlLoads(url, policy.media))) return "Could not load a file from this URL";

        setError(null);
        commit([...base(), createUrlItem(url)]);
        return null;
    };

    const itemProps = (item: FileItem, index: number): FileItemRenderProps => {
        const deleted = item.kind === "existing" && item.deleted;
        return {
            item, index, total: value.length, deleted, disabled,
            canMoveBack: !disabled && !single && !deleted && index > 0,
            canMoveForward: !disabled && !single && !deleted && index < value.length - 1,
            move: (dir) => commit(moveItem(latest.current, index, dir)),
            remove: () => { setError(null); commit(removeItem(latest.current, item)); },
            restore: () => commit(restoreItem(single ? dropActive(latest.current) : latest.current, item)),
            reorderable: !single
        };
    };

    return {
        policy, items: value, single, activeCount, canAdd, disabled, error,
        itemProps,
        addFiles, addUrl,
        source: { policy, multiple: !single, onFiles: addFiles, onUrl: addUrl },
        fields: {
            manifestName, filesName,
            manifest: JSON.stringify(buildManifest(value)),
            files: value.flatMap((i) => (i.kind === "new" ? [i.file] : []))
        }
    };
}

export type FileInputController = ReturnType<typeof useFileInput>;