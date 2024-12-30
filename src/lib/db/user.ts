import prisma from ".";
import { hashPassword } from "../auth/password";

export const getUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: {id}
    });
}

export const deleteUserById = async (userId: string) => {
    return await prisma.user.delete({
        where: {id: userId}
    });
}

export const createUser = async (name: string, profileImage: string | null, password: string | null) => {
    return await prisma.user.create({
        data: {
            name,
            hashedPassword: password ? hashPassword(password) : null,
            profileImage: profileImage,
            verifiedEmail: false
        }
    });
}

export const updateUserEmail = async (userId: string, email: string) => {
    return await prisma.email.upsert({
        where: {email},
        update: {
            userId: userId
        },
        create: {
            email,
            userId: userId,
            primary: false,
            verified: false
        }
    });
}

export const updateUserPassword = async (userId: string, password: string) => {
    return await prisma.user.update({
        where: {id: userId},
        data: {hashedPassword: hashPassword(password)}
    });
}

export const updateUserImage = async (userId: string, profileImage: string | null) => {
    return await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            profileImage: profileImage
        }
    });
}

export const updateUserProfile = async (userId: string, name: string, bio: string | null) => {
    return await prisma.user.update({
        where: {id: userId},
        data: {name, bio}
    });
}

export const setUserEmailVerified = async (userId: string) => {
    return prisma.user.update({
        where: {id: userId},
        data: {verifiedEmail: true}
    });
}