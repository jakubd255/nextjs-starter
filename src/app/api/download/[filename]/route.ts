import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";

export const GET = async (_: Request, {params}: {params: {filename: string}}): Promise<Response> => {
    const {filename} = params;
    
    const filePath = join(process.cwd(), "uploads", filename);

    try {
        const fileBuffer = await readFile(filePath);
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename=${filename}`
            },
        });
    }
    catch(error) {
        return new NextResponse("File not found", {status: 404});
    }
}