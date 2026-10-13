import { acceptAttr, FilePolicy } from "@/lib/upload/policy";
import { ReactNode, useRef } from "react";
import ActionsMenu, { MenuEntry } from "../actions-menu";
import { Link2, Upload } from "lucide-react";
import AddFileUrlDialog from "./add-file-url-dialog";

type Source = "device" | "url";

interface Props {
    policy: FilePolicy;
    onFiles: (files: File[]) => void;
    onUrl: (url: string) => Promise<string | null>;
    trigger: ReactNode;
    sources?: Source[];
    multiple?: boolean;
    extraEntries?: MenuEntry[];
    align?: "start" | "center" | "end";
}

export default function FileSourceMenu({
    policy, 
    onFiles, 
    onUrl, 
    trigger,
    sources = ["device", "url"], 
    multiple = false, 
    extraEntries = [], 
    align = "start"
}: Props) {
    const pickerRef = useRef<HTMLInputElement>(null);

    const entries: MenuEntry[] = [
        {
            label: "Upload from device",
            icon: Upload,
            hidden: !sources.includes("device"),
            onSelect: () => pickerRef.current?.click(),
        },
        {
            label: "Add from URL",
            icon: Link2,
            hidden: !sources.includes("url"),
            dialog: <AddFileUrlDialog media={policy.media} onSubmit={onUrl} />,
        },
        ...extraEntries
    ];

    return(
        <>
            <ActionsMenu trigger={trigger} entries={entries} align={align} bare/>
            <input
                ref={pickerRef}
                type="file"
                hidden
                multiple={multiple}
                accept={acceptAttr(policy)}
                onChange={(e) => {
                    onFiles(Array.from(e.target.files ?? []));
                    e.target.value = "";
                }}
            />
        </>
    );
}