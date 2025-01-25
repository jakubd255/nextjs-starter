import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

type Props = {params: Promise<{file: string}>}

export const GET = async (_: NextRequest, props: Props): Promise<Response> => {
    const params = await props.params;
    const {file} = params;
    
    const filePath = join(process.cwd(), "uploads", file);

    try {
        const fileBuffer = await readFile(filePath);
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename=${file}`
            },
        });
    }
    catch(error) {
        return new NextResponse("File not found", {status: 404});
    }
}