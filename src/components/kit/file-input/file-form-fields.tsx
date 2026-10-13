import { buildManifest, FileItem } from "@/lib/upload/file-items";

interface Props {
    items: FileItem[];
    manifestName?: string;
    filesName?: string;
}

export default function FileFormFields({items, manifestName = "manifest", filesName = "files"}: Props) {
    const syncFiles = (input: HTMLInputElement | null) => {
        if(!input) return;
        const dt = new DataTransfer();
        items.forEach((i) => i.kind === "new" && dt.items.add(i.file));
        input.files = dt.files;
    }

    return(
        <>
            <input type="hidden" name={manifestName} value={JSON.stringify(buildManifest(items))}/>
            <input ref={syncFiles} type="file" name={filesName} multiple hidden tabIndex={-1} aria-hidden/>
        </>
    );
}