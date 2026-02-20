import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
    "/favicon.ico"
];

const PUBLIC_PREFIXES = [
    "/auth",
    "/api/auth",
    "/api/download",
    "/forbidden"
];

export const proxy = (request: NextRequest) => {
    const {pathname, search} = request.nextUrl;

    const isExactPublic = PUBLIC_ROUTES.includes(pathname);
    const isPrefixPublic = PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    const sessionId = request.cookies.get("auth_session")?.value;

    if(!isExactPublic && !isPrefixPublic && !sessionId) {
        const loginUrl = new URL("/auth/log-in", request.url);

        if(pathname !== "/") {
            const fullPath = search ? `${pathname}${search}` : pathname;
            loginUrl.searchParams.set("redirectTo", fullPath);
        }
        
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}