import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

const  prisma = new PrismaClient();
export default prisma;

export const adapter = new PrismaAdapter(prisma.session, prisma.user);