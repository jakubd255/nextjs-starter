import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Ellipsis } from "lucide-react";
import { Email } from "@prisma/client";
import Link from "next/link";
import { useAccountSettings } from "./providers/account-settins-provider";

interface EmailMenuProps {
    email: Email;
}

export default function EmailMenu({email}: EmailMenuProps) {
    const {deleteEmail, setPrimary} = useAccountSettings();
    
    const handleDeleteEmail = () => deleteEmail(email.id);
    const handleSetPrimary = () => setPrimary(email.id);

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="!h-8 !w-8">
                    <Ellipsis className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleSetPrimary} disabled={email.primary || !email.verified}>
                    Set primary 
                </DropdownMenuItem>
                <DropdownMenuItem disabled={email.verified} asChild>
                    <Link href={`/auth/verify-email?emailId=${email.id}`}>
                        Verify
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteEmail} disabled={email.primary}>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}