import { directKey } from "./names";
import { FilePolicy } from "./policy";

interface Options {
    file: File;
    policy: FilePolicy;
    scope: string;
    onProgress: (percent: number) => void;
    signal?: AbortSignal;
}

const abortError = () => new DOMException("Aborted", "AbortError");

export async function uploadDirect({file, policy, scope, onProgress, signal}: Options): Promise<string> {
    const key = directKey(scope, file.name);

    if(process.env.NEXT_PUBLIC_STORAGE_PROVIDER === "vercel-blob") {
        const {upload} = await import("@vercel/blob/client");
        const blob = await upload(key, file, {
            access: "public",
            handleUploadUrl: "/api/upload/vercel",
            clientPayload: JSON.stringify({policyKey: policy.key}),
            multipart: file.size > 100 * 1024 * 1024,
            abortSignal: signal,
            onUploadProgress: ({percentage}) => onProgress(percentage),
        });
        return blob.url;
    }

    return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", `/api/upload/local?key=${encodeURIComponent(key)}&policy=${policy.key}`);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

        xhr.upload.onprogress = (e) => e.lengthComputable && onProgress((e.loaded / e.total) * 100);
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.onload = () => {
            if(xhr.status >= 200 && xhr.status < 300) return resolve(JSON.parse(xhr.responseText).url);
            let message = "Upload failed";
            try {message = JSON.parse(xhr.responseText).error ?? message;} catch {}
            reject(new Error(message));
        };

        signal?.addEventListener("abort", () => { 
            xhr.abort(); 
            reject(abortError());
        }, {once: true});
        if(signal?.aborted) return reject(abortError());
        xhr.send(file);
    });
}