import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return(
        <div className="mt-10 flex flex-col gap-5 items-center w-full">
            <div>
                <h1 className="text-6xl font-bold text-center">
                    404
                </h1>
                <h2 className="text-xl text-center">
                    Could not find requested resource
                </h2>
            </div>
            <Button asChild>
                <Link href="/" className="flex gap-2 items-center">
                    <Home className="h-4 w-4"/>
                    Go back home
                </Link>
            </Button>
        </div>
    );
}