import { createWriteStream } from "fs";
import { mkdir, unlink } from "fs/promises";
import { dirname } from "path";
import { Readable, Transform } from "stream";
import { pipeline } from "stream/promises";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth/session";
import { isValidDirectKey } from "@/lib/upload/names";
import { matchesAccept, policyByKey } from "@/lib/upload/policy";
import { resolveUploadPath } from "@/lib/storage/local-paths";

export const runtime = "nodejs";

export async function PUT(req: Request) {
    if (process.env.VERCEL) return NextResponse.json({error: "Not available"}, {status: 404});

    const {user} = await validateRequest();
    if (!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const params = new URL(req.url).searchParams;
    const key = params.get("key") ?? "";
    const policy = policyByKey(params.get("policy"));
    if(!policy || !req.body || !isValidDirectKey(key, user.id)) {
        return NextResponse.json({ error: "Invalid upload" }, {status: 400});
    }

    const name = key.split("/").pop()!;
    if(!matchesAccept({name, type: req.headers.get("content-type") ?? ""}, policy)) {
        return NextResponse.json({ error: "Unsupported file type" }, {status: 415});
    }
    if(Number(req.headers.get("content-length") ?? 0) > policy.maxSize) {
        return NextResponse.json({error: "File too large"}, {status: 413});
    }

    const rel = key.slice("uploads/".length);
    const target = resolveUploadPath(rel);
    await mkdir(dirname(target), {recursive: true});

    let received = 0;
    const limit = new Transform({
        transform(chunk, _enc, cb) {
            received += chunk.length;
            cb(received > policy.maxSize ? new Error("File too large") : null, chunk);
        }
    });

    try {
        await pipeline(Readable.fromWeb(req.body as never), limit, createWriteStream(target));
    }
    catch {
        await unlink(target).catch(() => {});
        return NextResponse.json({error: "Upload failed"}, {status: 413});
    }

    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/download/${rel.split("/").map(encodeURIComponent).join("/")}`;
    return NextResponse.json({url});
}