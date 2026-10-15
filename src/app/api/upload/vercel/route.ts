import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth/session";
import { isValidDirectKey } from "@/lib/upload/names";
import { policyByKey } from "@/lib/upload/policy";

export async function POST(request: Request) {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const json = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname, clientPayload) => {
                const {user} = await validateRequest();
                if (!user) throw new Error("Unauthorized");

                const {policyKey} = JSON.parse(clientPayload ?? "{}");
                const policy = policyByKey(policyKey);
                if (!policy || !isValidDirectKey(pathname, user.id)) throw new Error("Invalid upload");

                const types = policy.accept.filter((t) => t.includes("/") && t !== "*");
                return {
                    allowedContentTypes: types.length ? types : undefined,
                    maximumSizeInBytes: policy.maxSize,
                    addRandomSuffix: false,
                    allowOverwrite: false
                }
            },
            onUploadCompleted: async () => {}
        });
        return NextResponse.json(json);
    } 
    catch(error) {
        return NextResponse.json({error: (error as Error).message}, {status: 400});
    }
}