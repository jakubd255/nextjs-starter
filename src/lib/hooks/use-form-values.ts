import { useState } from "react";

export const useFormValues = <T extends Record<string, string>>(initial: T) => {
    const [values, setValues] = useState(initial);

    const set = <K extends keyof T>(name: K, value: string) => setValues(prev => ({...prev, [name]: value}));

    const bind = <K extends keyof T & string>(name: K) => ({
        name,
        value: values[name],
        onValueChange: (value: string) => set(name, value)
    });

    const reset = () => setValues(initial);

    return {values, bind, set, reset}
}