"use client";

import { ChangeEventHandler, useState } from "react";
import { Input } from "./ui/input";
import ShowPasswordToggle from "./show-password-toggle";

interface PasswordInputProps {
    id?: string;
    name?: string;
    value?: string;
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
}

export default function PasswordInput({id, name, value, onChange}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return(
        <div className="flex gap-1">
            <Input 
                type={showPassword ? "text" : "password"} 
                name={name}
                id={id}
                value={value}
                onChange={onChange}
            />
            <ShowPasswordToggle 
                showPassword={showPassword} 
                toggleShowPassword={toggleShowPassword}
            />
        </div>
    );
}