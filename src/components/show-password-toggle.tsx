import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";

interface ShowPasswordToggleProps {
    showPassword: boolean;
    toggleShowPassword: () => void;
}

export default function ShowPasswordToggle({showPassword, toggleShowPassword}: ShowPasswordToggleProps) {
    return(
        <Button variant="outline" size="icon" type="button" onClick={toggleShowPassword}>
            {showPassword ? (
                <Eye className="cursor-pointer" />
            ) : (
                <EyeOff className="cursor-pointer"/>
            )}
        </Button>
    );
}