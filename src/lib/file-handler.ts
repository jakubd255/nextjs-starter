import { mkdir, unlink, writeFile } from "fs/promises";
import { extname, join } from "path";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = async (file: File) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "uploads");
    await mkdir(uploadDir, {recursive: true});

    const fileExtension = extname(file.name);
    const uniqueFileName = uuidv4()+fileExtension;

    const filePath = join(uploadDir, uniqueFileName);
    await writeFile(filePath, new Uint8Array(buffer));

    return uniqueFileName;
}

export const deleteFile = async (fileName: string) => {
    const filePath = join(process.cwd(), "uploads", fileName);

    try {
        await unlink(filePath);
    } 
    catch(error) {
        console.error(error);
    }
}

export const isLocalFile = (fileName: string) => {
    return !fileName.includes("http");
}