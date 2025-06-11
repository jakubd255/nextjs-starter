import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";

interface ShowPasswordToggleProps {
    showPassword: boolean;
    toggleShowPassword: () => void;
}

export default function ShowPasswordToggle({showPassword, toggleShowPassword}: ShowPasswordToggleProps) {
    return(
        <Button variant="outline" size="icon" type="button">
            {showPassword ? (
                <Eye
                    className="cursor-pointer"
                    onClick={toggleShowPassword}
                />
            ) : (
                <EyeOff
                    className="cursor-pointer"
                    onClick={toggleShowPassword}
                />
            )}
        </Button>
    );
}