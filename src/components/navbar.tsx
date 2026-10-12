import Link from "next/link";
import { DarkModeToggle } from "./dark-mode-toggle";
import NavbarUserMenu from "./navbar-user-menu";
import { User } from "lucia";

interface Props {
    user?: User;
}

export default function Navbar({user}: Props) {
    return(
        <header className="w-full px-4 py-2 z-10 flex justify-between items-center border-b sticky top-0 backdrop-blur bg-background/90">
            <Link href="/">
                <h1 className="text-2xl font-bold hover:underline">
                    NextJS Starter
                </h1>
            </Link>
            <div className="flex gap-2">
                <DarkModeToggle/>
                {user && <NavbarUserMenu user={user}/>}
            </div>
        </header>
    );
}