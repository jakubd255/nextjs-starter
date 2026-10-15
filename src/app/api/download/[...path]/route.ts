import { stat } from "fs/promises";
import { NextRequest } from "next/server";
import { lookup } from "mime-types";
import { Readable } from "stream";
import { createReadStream } from "fs";
import { resolveUploadPath } from "@/lib/storage/local-paths";

interface Props {
    params: Promise<{path: string[]}>;
}

export const GET = async (_: NextRequest, props: Props): Promise<Response> => {
    const params = await props.params;
    const {path} = params;

    try {
        const file = resolveUploadPath(path.map(decodeURIComponent).join("/"));
        const info = await stat(file);
        const type = lookup(file) || "application/octet-stream";
        const inline = type.startsWith("image/") || type.startsWith("video/");

        return new Response(Readable.toWeb(createReadStream(file)) as ReadableStream, {
            headers: {
                "Content-Type": type,
                "Content-Length": String(info.size),
                "X-Content-Type-Options": "nosniff",
                "Cache-Control": "public, max-age=31536000, immutable",
                ...(inline ? {} : {"Content-Disposition": "attachment"})
            }
        });
    }
    catch {
        return new Response("Not found", {status: 404});
    }
}