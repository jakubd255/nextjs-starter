import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import schema from "./schema";
import { sessions } from "./schema/sessions";
import { users } from "./schema/users";

const client = new Pool({
    connectionString: process.env.DB_URL!,
});

const db = drizzle({client, schema});

export default db;

export const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);