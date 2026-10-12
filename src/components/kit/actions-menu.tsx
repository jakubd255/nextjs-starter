"use client";

import { Ellipsis, LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import DialogLauncher from "./dialog-launcher";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Link from "next/link";

export type MenuAction = {
    label: string;
    icon?: LucideIcon;
    hidden?: boolean;
    disabled?: boolean;
    destructive?: boolean;
} & (
    | {href: string}
    | {onSelect: () => any | Promise<any>}
    | {dialog: React.ReactNode}
);

export type MenuEntry = MenuAction | {separator: true} | {heading: string};

const isSeparator = (e: MenuEntry): e is { separator: true } => "separator" in e;
const isHeading = (e: MenuEntry): e is { heading: string } => "heading" in e;
const isAction = (e: MenuEntry): e is MenuAction => "label" in e;

const tidy = (entries: MenuEntry[]) => {
    const out: MenuEntry[] = [];
    for(const e of entries) {
        if(isAction(e) && e.hidden) continue;
        if(isSeparator(e) && (out.length === 0 || isSeparator(out[out.length - 1]))) continue;
        out.push(e);
    }
    while (out.length && isSeparator(out[out.length - 1])) out.pop();
    return out;
}

interface Props {
    entries: MenuEntry[];
    trigger?: React.ReactNode;
    triggerVariant?: React.ComponentProps<typeof Button>["variant"];
    triggerClassName?: string;
    label?: string;
    align?: "start" | "center" | "end";
    bare?: boolean;
}

const TRIGGER_ICON = <Ellipsis className="w-4 h-4"/>;

export default function ActionsMenu({entries, trigger = TRIGGER_ICON, triggerVariant = "ghost", triggerClassName, label = "Actions", align, bare}: Props) {
    const [dialog, setDialog] = useState<{node: React.ReactNode; open: boolean}>();

    const visible = tidy(entries);
    if(!visible.some(isAction)) return null;

    return(
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {bare ? trigger : (
                        <Button variant={triggerVariant} size="icon" className={triggerClassName} aria-label={label}>
                            {trigger}
                        </Button>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align={align}>
                    {visible.map((entry, i) => {
                        if(isSeparator(entry)) return <DropdownMenuSeparator key={i}/>;
                        if(isHeading(entry)) return(
                            <DropdownMenuLabel key={i}>
                                {entry.heading}
                            </DropdownMenuLabel>
                        );

                        const content = (
                            <>
                                {entry.icon && <entry.icon className="w-4 h-4" />}
                                {entry.label}
                            </>
                        );
                        const itemProps = {
                            disabled: entry.disabled,
                            variant: entry.destructive ? ("destructive" as const) : undefined
                        };

                        if("href" in entry) {
                            return (
                                <DropdownMenuItem key={entry.label} {...itemProps} asChild>
                                    <Link href={entry.href}>
                                        {content}
                                    </Link>
                                </DropdownMenuItem>
                            );
                        }
                        return(
                            <DropdownMenuItem
                                key={entry.label}
                                {...itemProps}
                                onSelect={"dialog" in entry
                                    ? () => setDialog({node: entry.dialog, open: true})
                                    : entry.onSelect
                                }
                            >
                                {content}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            {dialog && (
                <DialogLauncher
                    open={dialog.open}
                    onOpenChange={open => setDialog(d => d && {...d, open})}
                >
                    {dialog.node}
                </DialogLauncher>
            )}
        </>
    );
}