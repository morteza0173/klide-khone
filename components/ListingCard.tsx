import Image from "next/image";
import Link from "next/link";
import { AddToFavoriteButton, DeleteFromFavoriteButton } from "./SubmiteButton";
import { addToFavorite, deleteFromFavorite } from "@/app/action";

interface props {
  photo: string;
  description: string;
  price: number;
  country: string;
  city: string;
  title: string;
  userId: string;
  isInFavoriteList: boolean;
  favoriteId: string;
  homeId: string;
  pathName: string;
}

function ListingCard({
  photo,
  description,
  price,
  country,
  city,
  title,
  userId,
  favoriteId,
  pathName,
  homeId,
  isInFavoriteList,
}: props) {
  console.log(isInFavoriteList);

  return (
    <div className="flex flex-col">
      <div className="relative h-72">
        <Image
          src={`https://bymduyiqpqrwlrojytxs.supabase.co/storage/v1/object/public/images/${photo}`}
          alt={title}
          fill
          className="rounded-lg h-full object-cover mb-3"
        />
        {userId && (
          <div className="z-10 absolute top-2 left-2">
            {isInFavoriteList ? (
              <form action={deleteFromFavorite}>
                <input type="hidden" name="favoriteId" value={favoriteId} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="pathName" value={pathName} />
                <DeleteFromFavoriteButton />
              </form>
            ) : (
              <form action={addToFavorite}>
                <input type="hidden" name="homeId" value={homeId} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="pathName" value={pathName} />
                <AddToFavoriteButton />
              </form>
            )}
          </div>
        )}
      </div>
      <Link href={`/home/${homeId}`} className="">
        <div className="w-full grid grid-cols-10 items-center  mt-2">
          <h2 className="col-span-6 font-medium ">{title}</h2>
          <h3 className="text-xs font-medium col-span-4 bg-muted py-2 rounded text-center">
            {country} , {city}
          </h3>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-2">
          {description}
        </p>
        <p className="mt-2 text-muted-foreground text-sm">
          <span className="font-medium text-black text-base">{price} تومن</span>{" "}
          برای هر شب
        </p>
      </Link>
    </div>
  );
}
export default ListingCard;
