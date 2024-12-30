import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GitHubIcon } from "../image-icons";


export default function GitHubLoginForm() {
    return(
        <form className="flex flex-col">
            <Button variant="outline" asChild>
                <Link href="/api/auth/github">
                    <GitHubIcon/>
                    Continue with GitHub
                </Link>
            </Button>
        </form>
    );
}