import { directKey } from "./names";
import { FilePolicy, MB } from "./policy";

export interface UploadOptions {
    file: File;
    policy: FilePolicy;
    scope: string;
    onProgress: (percent: number) => void;
    signal?: AbortSignal;
}

type Uploader = (o: UploadOptions & {key: string}) => Promise<string>;
const abortError = () => new DOMException("Aborted", "AbortError");

const vercelBlob: Uploader = async ({key, file, policy, onProgress, signal}) => {
    const {upload} = await import("@vercel/blob/client");
    const blob = await upload(key, file, {
        access: "public",
        handleUploadUrl: "/api/upload/vercel",
        clientPayload: JSON.stringify({policyKey: policy.key}),
        multipart: file.size > 100*MB,
        abortSignal: signal,
        onUploadProgress: ({percentage}) => onProgress(percentage)
    });
    return blob.url;
};

const local: Uploader = ({key, file, policy, onProgress, signal}) => new Promise<string>((resolve, reject) => {
    if(signal?.aborted) return reject(abortError());

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `/api/upload/local?key=${encodeURIComponent(key)}&policy=${policy.key}`);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress((e.loaded / e.total) * 100);
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.onload = () => {
        let body: {url?: string; error?: string} = {};
        try { 
            body = JSON.parse(xhr.responseText);
        } catch {}
        if(xhr.status >= 200 && xhr.status < 300 && body.url) resolve(body.url);
        else reject(new Error(body.error ?? "Upload failed"));
    };
    signal?.addEventListener("abort", () => {
        xhr.abort(); 
        reject(abortError()); 
    }, {once: true});
    xhr.send(file);
});

const uploaders: Record<string, Uploader> = {"vercel-blob": vercelBlob, local};

export const uploadDirect = (o: UploadOptions) => (uploaders[String(process.env.NEXT_PUBLIC_STORAGE_PROVIDER)] ?? local)({...o, key: directKey(o.scope, o.file.name)});