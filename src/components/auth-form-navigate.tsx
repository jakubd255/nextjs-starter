import Link from "next/link";

interface AuthFormNavigateProps {
    text: string;
    href: string;
    name: string;
}

export default function AuthFormNavigate({text, href, name}: AuthFormNavigateProps) {
    return(
        <div>
            {text} &nbsp;
            <Link href={href} className="font-bold hover:underline">
                {name}
            </Link>
        </div>
    );
}