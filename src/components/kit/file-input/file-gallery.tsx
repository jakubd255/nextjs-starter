"use client";

import { cn } from "@/lib/utils/cn";
import FileAddTrigger from "./file-add-trigger";
import FileCard from "./file-card";
import FileFormFields from "./file-form-fields";
import FileSourceMenu from "./file-source-menu";
import { FileInput } from "@/lib/upload/use-file-input";

interface Props {
    input: FileInput;
    disabled?: boolean;
    manifestName?: string;
    filesName?: string;
    tileClassName?: string;
    listClassName?: string;
    className?: string;
}

const DEFAULT_TILE = "size-24 sm:size-32 lg:size-48";

export default function FileGallery({
    input,
    disabled,
    manifestName = "manifest",
    filesName = "files",
    tileClassName = DEFAULT_TILE,
    listClassName,
    className
}: Props) {
    return(
        <div className={cn("space-y-2", className)}>
            <ul className={cn("flex flex-wrap gap-3", listClassName)}>
                {input.items.map((item, index) => (
                    <FileCard
                        key={item.id}
                        input={input}
                        item={item}
                        index={index}
                        className={tileClassName}
                        disabled={disabled}
                    />
                ))}
                {input.canAdd && (
                    <li className={tileClassName}>
                        <FileSourceMenu
                            {...input.source}
                            trigger={<FileAddTrigger disabled={disabled}/>}
                        />
                    </li>
                )}
            </ul>
            {!input.single && (
                <p className="text-xs text-muted-foreground">
                    {input.activeCount}/{input.policy.maxFiles} files
                </p>
            )}
            {input.error && (
                <p role="alert" className="text-sm font-medium text-destructive">{input.error}</p>
            )}
            <FileFormFields items={input.items} manifestName={manifestName} filesName={filesName}/>
        </div>
    );
}