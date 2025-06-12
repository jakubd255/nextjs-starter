"use client";

import { Input } from "@/components/ui/input";
import { UAParser } from "ua-parser-js";

const getDeviceInfo = () => {
    const parser = new UAParser();
    const result = parser.getResult();
    
    return {
        browser: result.browser.name,
        os: result.os.name,
    };
}

export default function DeviceInfoCollector() {
    const {os, browser} = getDeviceInfo();
    
    return(
        <>
            <Input 
                type="hidden" 
                name="os" 
                value={os}
            />
            <Input 
                type="hidden" 
                name="browser" 
                value={browser}
            />
        </>
    );
}