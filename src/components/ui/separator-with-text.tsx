import { Separator } from "./separator";

interface SeparatorWithTextProps {
    text: string;
}

export default function SeparatorWithText({text}: SeparatorWithTextProps) {
    return(
        <div className="relative flex items-center justify-center overflow-hidden">
            <Separator/>
            <div className="px-2 text-center text-sm text-muted-foreground">
                {text}
            </div>
            <Separator/>
        </div>
    );
}