import ListingCard from "@/components/ListingCard";
import NoItems from "@/components/NoItems";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

async function getData(userId: string) {
  const data = await prisma.favorite.findMany({
    where: {
      userId: userId,
    },
    select: {
      Home: {
        select: {
          photo: true,
          id: true,
          description: true,
          price: true,
          country: true,
          city: true,
          title: true,
          favorite: true,
        },
      },
    },
  });
  return data;
}

async function page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/");
  }
  const data = await getData(user.id);

  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold">لیست علاقه مندی شما</h2>
      {data.length === 0 ? (
        <NoItems
          title="خانه ای در لیست علاقه مندی شما پیدا نشد ..."
          description="لطفا از خانه های موجود خانه ای را در لیست علاقه مندی قرار دهید"
        />
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 mt-8">
          {data.map((item) => {
            return (
              <ListingCard
                key={item.Home?.id}
                description={item.Home?.description as string}
                photo={item.Home?.photo as string}
                country={item.Home?.country as string}
                city={item.Home?.city as string}
                title={item.Home?.title as string}
                price={item.Home?.price as number}
                userId={user.id}
                favoriteId={item.Home?.favorite[0]?.id as string}
                isInFavoriteList={
                  (item.Home?.favorite?.length as number) > 0 ? true : false
                }
                homeId={item.Home?.id as string}
                pathName="/favorites"
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
export default page;
