import { countUsersByRole, createUser } from "./queries/users";

export const initAdmin = async () => {
    const count = await countUsersByRole("ADMIN");
    if(!count) {
        const email = process.env.ADMIN_EMAIL!;
        const password = process.env.ADMIN_PASSWORD!;

        await createUser("Admin", email, password, "ADMIN", true);
        console.log("Admin has been created");
    }
}