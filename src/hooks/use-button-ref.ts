import { useRef } from "react";

export default function useButtonRef() {
    const ref = useRef<any>(null);
  
    const click = () => ref.current?.click();
  
    return {ref, click};
};