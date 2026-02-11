import UserAvatar from "@/components/user-avatar";
import { validateRequest } from "@/lib/auth";
import { forbidden } from "next/navigation";

export default async function Home() {
    const {user} = await validateRequest();
    if(!user) {
        forbidden();
    }
    
    return(
        <div className="flex flex-col gap-3 items-center">
            <UserAvatar user={user} size="lg"/>
            <h1 className="text-4xl font-bold">
                {user.name}
            </h1>
            <p className="max-w-150 text-wrap whitespace-pre-line">
                {user.bio}
            </p>
        </div>
    );
}