import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function redirectToAuth(): Promise<never> {
    const path = (await headers()).get("x-current-path");
    const redirectTo = !path || path === "/" ? "/auth/log-in" : `/auth/log-in?redirectTo=${encodeURIComponent(path)}`;
    return redirect(redirectTo);
}