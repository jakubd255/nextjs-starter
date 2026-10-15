export interface StorageObjectMeta {
    size: number; 
    contentType?: string
}

export interface StorageProvider {
    upload(file: File, key: string): Promise<{url: string}>;
    delete(url: string): Promise<void>;
    owns(url: string): boolean;
    head(url: string): Promise<StorageObjectMeta | null>;
    read?(key: string): Promise<{stream: ReadableStream; contentType: string} | null>;
}