"use client";

import Link from "next/link";
import FormSubmitError from "./form-submit-error";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import PasswordInput from "./password-input";
import { SelectInput, SelectInputProps } from "./select-input";
import { Textarea } from "@/components/ui/textarea";

interface FieldProps {
    name: string;
    label: string;
    errors?: string[];
    description?: string;
    labelAction?: React.ReactNode;
    children: React.ReactNode;
}

export function Field({name, label, errors, description, labelAction, children}: FieldProps) {
    return(
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
                <Label htmlFor={name}>
                    {label}
                </Label>
                {labelAction}
            </div>
            {children}
            {description && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            <FormSubmitError errors={errors} />
        </div>
    );
}

type Base = Pick<FieldProps, "name" | "label" | "errors" | "description"> & {
    value?: string;
    onValueChange?: (value: string) => void;
};

type InputProps = Omit<React.ComponentProps<typeof Input>, "name" | "value" | "onChange">;

export function TextField({name, label, errors, description, value, onValueChange, ...props}: Base & InputProps) {
    return(
        <Field name={name} label={label} errors={errors} description={description}>
            <Input
                id={name}
                name={name}
                value={value}
                onChange={e => onValueChange?.(e.target.value)}
                {...props}
            />
        </Field>
    );
}

export function PasswordField({name, label, errors, description, value, onValueChange, forgotPassword, ...props}: Base & InputProps & {forgotPassword?: boolean}) {
    return(
        <Field
            name={name}
            label={label}
            errors={errors}
            description={description}
            labelAction={forgotPassword && (
                <Link className="font-bold text-sm text-primary hover:underline" href="/auth/forgot-password">
                    Forgot password?
                </Link>
            )}
        >
            <PasswordInput
                id={name}
                name={name}
                value={value}
                onChange={e => onValueChange?.(e.target.value)}
                {...props}
            />
        </Field>
    );
}

type UrlInputProps = Omit<InputProps, "type">;

export function UrlField({name, label, errors, description, value, onValueChange, ...props}: Base & UrlInputProps) {
    return(
        <Field name={name} label={label} errors={errors} description={description}>
            <Input
                id={name}
                name={name}
                type="url"
                value={value}
                onChange={e => onValueChange?.(e.target.value)}
                {...props}
            />
        </Field>
    );
}

type TextareaProps = Omit<React.ComponentProps<typeof Textarea>, "name" | "value" | "onChange">;

export function TextareaField({name, label, errors, description, value, onValueChange, ...props}: Base & TextareaProps) {
    return(
        <Field name={name} label={label} errors={errors} description={description}>
            <Textarea
                id={name}
                name={name}
                value={value}
                onChange={e => onValueChange?.(e.target.value)}
                {...props}
            />
        </Field>
    );
}

export function SelectField({name, label, errors, description, ...select}: Base & Omit<SelectInputProps, "name" | "id">) {
    return(
        <Field name={name} label={label} errors={errors} description={description}>
            <SelectInput name={name} {...select}/>
        </Field>
    );
}