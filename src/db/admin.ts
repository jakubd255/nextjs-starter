import { upsertEmail } from "./queries/emails";
import { countByRole, createUser } from "./queries/users";

export const initAdmin = async () => {
    const count = await countByRole("ADMIN");
    if(!count) {
        const admin = await createUser("Admin", process.env.ADMIN_PASSWORD!, "ADMIN");
        await upsertEmail(admin.id, process.env.ADMIN_EMAIL!, true);
        console.log("Admin has been created");
    }
}