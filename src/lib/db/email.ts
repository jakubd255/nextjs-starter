import prisma from ".";

interface UpdateEmailData {
    userId: string;
    verified: true;
    primary: true;
}

export const createEmail = async (email: string, userId: string) => {
    return await prisma.email.create({
        data: {
            email: email,
            userId: userId,
            verified: true,
            primary: true
        }
    });
}

export const updateEmail = async (emailId: string, data: Partial<UpdateEmailData>) => {
    return await prisma.email.update({
        where: {id: emailId},
        data: data
    });
}

export const findEmail = async (email: string) => {
    return await prisma.email.findUnique({
        where: {email}
    });
}

export const findEmailById = async (emailId: string) => {
    return await prisma.email.findUnique({
        where: {id: emailId}
    });
}

export const deleteEmail = async (userId: string, emailId: string) => {
    const email = await prisma.email.findUnique({
        where: {id: emailId, primary: false, userId: userId}
    });
    if(!email) {
        return false;
    }

    await prisma.email.delete({
        where: {id: emailId, primary: false, userId: userId}
    });

    return true;
}

export const findEmailAndUser = async (email: string) => {
    return await prisma.email.findUnique({
        where: {email},
        include: {user: true}
    });
}

export const findEmailByIdAndUser = async (emailId: string) => {
    return await prisma.email.findUnique({
        where: {id: emailId},
        include: {user: true}
    });
}

export const findVerifiedEmailAndUser = async (email: string) => {
    return await prisma.email.findFirst({
        where: {email, verified: true},
        include: {user: true}
    });
}

export const upsertEmail = async (email: string, userId: string) => {
    return await prisma.email.upsert({
        where: {email, verified: false},
        update: {
            userId: userId,
            primary: true,
            verified: false
        },
        create: {
            email: email,
            userId: userId,
            primary: true,
            verified: false
        }
    });
}

export const setEmailPrimary = async (userId: string, emailId: string) => {
    const email = await prisma.email.findUnique({
        where: {id: emailId, primary: false, userId: userId}
    });
    if(!email) {
        return false;
    }

    await prisma.email.updateMany({
        where: {userId: userId, primary: true},
        data: {primary: false}
    });

    await prisma.email.update({
        where: {id: emailId, primary: false, userId: userId},
        data: {primary: true}
    });

    return true;
}

export const setEmailVerified = async (emailId: string) => {
    return await prisma.email.update({
        where: {id: emailId},
        data: {
            verified: true,
        }
    });
}

export const getEmails = async (userId: string) => {
    return await prisma.email.findMany({
        where: {userId: userId}
    });
}