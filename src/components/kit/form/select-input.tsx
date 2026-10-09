"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "../../ui/select";

export const NONE = "__none__";
export const noneToNull = (v: unknown) => (v === NONE || v === "" ? null : v);

export interface SelectOption {
    value: string;
    label: React.ReactNode;
    disabled?: boolean;
}

export interface SelectInputProps {
    options: SelectOption[];
    id?: string;
    name?: string;
    value?: string;
    defaultValue?: string | null;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    emptyLabel?: string;
    groupLabel?: string;
    disabled?: boolean;
    className?: string;
    selectFirst?: boolean;
}

export function getInitialValue({options, defaultValue, selectFirst, emptyLabel}: Pick<SelectInputProps, "options" | "defaultValue" | "selectFirst" | "emptyLabel">) {
    if(defaultValue != null) return defaultValue;
    if(selectFirst) return options.find(o => !o.disabled)?.value;
    if(emptyLabel) return NONE;
    return undefined;
}

export function SelectInput(props: SelectInputProps) {
    const {options, id, name, value, onValueChange, placeholder, emptyLabel, groupLabel, disabled, className} = props;

    const items = options.map(o => (
        <SelectItem key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
        </SelectItem>
    ));

    return(
        <Select
            name={name}
            value={value}
            onValueChange={onValueChange}
            defaultValue={value === undefined ? getInitialValue(props) : undefined}
            disabled={disabled}
        >
            <SelectTrigger id={id ?? name} className={className ?? "w-full"}>
                <SelectValue placeholder={placeholder}/>
            </SelectTrigger>
            <SelectContent>
                {emptyLabel && (
                    <>
                        <SelectItem value={NONE}>
                            {emptyLabel}
                        </SelectItem>
                        <SelectSeparator/>
                    </>
                )}
                {groupLabel ? (
                    <SelectGroup>
                        <SelectLabel>
                            {groupLabel}
                        </SelectLabel>
                        {items}
                    </SelectGroup>
                ) : items}
            </SelectContent>
        </Select>
    );
}