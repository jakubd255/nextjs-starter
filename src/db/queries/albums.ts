import db from "..";
import { eq} from "drizzle-orm"
import { albums } from "../schema";

export const getAlbumByUserId = async (userId: string) => {
    const res = await db
        .select()
        .from(albums)
        .where(eq(albums.userId, userId)).limit(1);

    return res[0] ?? null;
}

export const upsertAlbumImages = async (userId: string, images: string[]) => {
    await db
        .insert(albums)
        .values({userId, images})
        .onConflictDoUpdate({
            target: albums.userId,
            set: {images}
        });
};