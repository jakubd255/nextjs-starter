import prisma from ".";
import { GitHubUser } from "../auth/github";

export const createGitHubAccount = async (userId: string, githubUser: GitHubUser) => {
    return await prisma.account.create({
        data: {
            userId: userId,
            providerName: "github",
            providerUserId: String(githubUser.id),
            username: githubUser.login
        }
    });
}

export const getAccounts = async (userId: string) => {
    return await prisma.account.findMany({
        where: {userId: userId}
    });
}

export const getGitHubAccountAndUser = async (githubUser: GitHubUser) => {
    return await prisma.account.findFirst({
        where: {
            providerName: "github",
            providerUserId: String(githubUser.id)
        },
        include: {user: true}
    });
}

export const deleteOAuthAccount = async (userId: string, provider: string) => {
    return await prisma.account.deleteMany({
        where: {
            userId: userId,
            providerName: provider
        }
    });
}