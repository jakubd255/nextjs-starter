"use client";

import { Input } from "@/components/ui/input";
import { UAParser } from "ua-parser-js";

export default function DeviceInfoCollector() {
    const parser = new UAParser();
    const {os, browser} = parser.getResult();
    
    return(
        <>
            <Input type="hidden" name="os" defaultValue={os.name} hidden/>
            <Input type="hidden" name="browser" defaultValue={browser.name} hidden/>
        </>
    );
}
