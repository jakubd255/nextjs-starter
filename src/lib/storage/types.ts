export interface StorageProvider {
    upload(file: File, key: string): Promise<{url: string}>;
    delete(key: string): Promise<void>;
    owns(url: string): boolean;
    head(url: string): Promise<{size: number; contentType?: string} | null>;
    read?(key: string): Promise<{stream: ReadableStream; contentType: string} | null>;
}