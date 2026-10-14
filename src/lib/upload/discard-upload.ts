"use server";

import { validateRequest } from "../auth/session";
import { storage } from "../storage";
import { isOwnedBy } from "./names";

export default async function discardUploadAction(url: string) {
    const {user} = await validateRequest();
    if(!user) return;

    if(!storage.owns(url) || !isOwnedBy(url, user.id)) return;

    await storage.delete(url);
}