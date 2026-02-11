"use server";

import { terminateSession, validateRequest } from "@/lib/auth";
import { actionFailure } from "@/lib/action-result";
import { redirect } from "next/navigation";

export default async function logOutAction() {
    const {session} = await validateRequest();
	if(!session) {
		return actionFailure({});
	}

	terminateSession(session.id);

	redirect("/auth/log-in");
}