import Link from "next/link";
import { DarkModeToggle } from "./dark-mode-toggle";
import NavbarUserMenu from "./navbar-user-menu";

interface NavbarProps {
    showUser?: boolean;
}

export default function Navbar({showUser=false}: NavbarProps) {
    return(
        <header className="w-full px-4 py-2 z-10 flex justify-between items-center border-b sticky top-0 backdrop-blur bg-white/90">
            <Link href="/">
                <h1 className="text-3xl hover:underline">
                    NextJS App
                </h1>
            </Link>
            <div className="flex gap-2">
                <DarkModeToggle/>
                {showUser && (
                    <NavbarUserMenu/>
                )}
            </div>
        </header>
    );
}