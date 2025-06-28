"use client";

import { Input } from "@/components/ui/input";
import { UAParser } from "ua-parser-js";

export default function DeviceInfoCollector() {
    const parser = new UAParser();
    const result = parser.getResult();
    
    return(
        <>
            <Input 
                type="hidden" 
                name="os" 
                value={result.os.name}
            />
            <Input 
                type="hidden" 
                name="browser" 
                value={result.browser.name}
            />
        </>
    );
}