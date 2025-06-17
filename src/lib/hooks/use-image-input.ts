import { ChangeEvent, useEffect, useRef, useState } from "react";

export default function useImageInput(initialImageUrl?: string | null) {
    const [image, setImage] = useState<File | null>(null);
    const [deleteImage, setDeleteImage] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string | null| undefined>(initialImageUrl);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(!image) {
            if(deleteImage) setPreviewUrl(null);
            if(inputRef.current) inputRef.current.value = "";
            return;
        }

        const objectUrl = URL.createObjectURL(image);
        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [image, deleteImage]);

    const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setImage(file);
        setDeleteImage(false);
    };

    const handleDelete = () => {
        setDeleteImage(true);
        setImage(null);
    };

    const handleReset = () => {
        setImage(null);
        setDeleteImage(false);
        setPreviewUrl(undefined);
    }

    return {image, deleteImage, previewUrl, inputRef, handleSelect, handleDelete, handleReset};
}