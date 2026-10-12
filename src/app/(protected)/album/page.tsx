import { AlbumImagesForm } from "@/components/album-images-form";
import { getAlbumByUserId } from "@/db/queries/albums";
import { requireAuth } from "@/lib/auth/session";

export default async function AlbumPage() {
    const {user} = await requireAuth();
    const album = await getAlbumByUserId(user.id);

    return(
        <div className="flex flex-col gap-6 w-full items-center">
            <h1 className="text-4xl font-bold">
                Album
            </h1>
            <AlbumImagesForm images={album?.images ?? []}/>
        </div>
    );
}