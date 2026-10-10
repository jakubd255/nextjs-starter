export interface StorageProvider {
    upload(file: File): Promise<{url: string}>;
    delete(key: string): Promise<void>;
    owns(url: string): boolean;
    read?(key: string): Promise<{stream: ReadableStream; contentType: string} | null>;
}