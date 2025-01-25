import { useRef } from "react";

export default function useFormRef() {
    const ref = useRef<HTMLFormElement>(null);

    const submit = () => ref.current?.requestSubmit();

    return {ref, submit};
}