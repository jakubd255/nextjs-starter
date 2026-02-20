export const encodeState = (request: Request, state: string) => {
    const urlObj = new URL(request.url);
	const redirectParam = urlObj.searchParams.get("redirectTo");
	const statePayload = JSON.stringify({
		csrf: state,
		redirectTo: redirectParam?.startsWith("/") ? redirectParam : null
	});

	return Buffer.from(statePayload).toString("base64");
}

export const decodeState = (state: string, storedState: string) => {
    let parsedState: {csrf: string; redirectTo: string | null};
    try {
        parsedState = JSON.parse(Buffer.from(state, "base64").toString());
    } 
    catch {
        return null;
    }
    if(parsedState.csrf !== storedState) {
        return null;
    }
    return parsedState;
}