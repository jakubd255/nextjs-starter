import { useSearchParams } from "next/navigation";

export default function useRedirectTo() {
    const params = useSearchParams();
	const value = params.get("redirectTo");

    if(value && value.startsWith("/") && !value.startsWith("//")) {
		return {redirectTo: value};
	}

    return undefined;
}