import { validateRequest } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function Home() {
    const {user} = await validateRequest();
    if(!user) {
        notFound();
    }
    
    return(
        <div className="flex flex-col gap-3 items-center">
            <h1 className="text-4xl font-bold">
                {user.name}
            </h1>
            <p className="max-w-150 text-wrap whitespace-pre-line">
                {user.bio}
            </p>
        </div>
    );
}