import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export const getDeviceInfo = async () => {
    const userAgent = (await headers()).get("user-agent") ?? "";
	const parser = new UAParser(userAgent);
	const {os, browser} = parser.getResult();

    return {
        os: String(os.name),
        browser: browser.name
    };
}