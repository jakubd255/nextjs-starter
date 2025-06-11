import { useState } from "react";

type ReturnType = [boolean, () => void];

export default function useShowPassword(init: boolean=false): ReturnType {
    const [showPassword, setShowPassword] = useState(init);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return [showPassword, togglePasswordVisibility];
}