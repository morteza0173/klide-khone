import ListingCard from "@/components/ListingCard";
import NoItems from "@/components/NoItems";
import ToastMessage from "@/components/ToastMessage";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

async function getData(userId: string) {
  try {
    const data = await prisma.home.findMany({
      where: {
        userId: userId,
        addedCategory: true,
        addedDescription: true,
        addedLoaction: true,
      },
      select: {
        photo: true,
        id: true,
        description: true,
        price: true,
        country: true,
        city: true,
        title: true,
        favorite: {
          where: {
            userId: userId,
          },
        },
      },
      orderBy: {
        createdAT: "desc",
      },
    });
    return data;
  } catch {
    return undefined;
  }
}

async function page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/");
  }
  const data = await getData(user.id);
  return (
    <>
      {!data && (
        <>
          <ToastMessage message="خطایی در دریافت اطلاعات به وجود آمد" />
          <h1 className="mt-10 text-center">
            خطایی رخ داده لطفا وضعیت اینترنت خود را بررسی و صفحه را مجدد باز
            کنید
          </h1>
        </>
      )}
      {data && (
        <section className="container mx-auto px-5 lg:px-10 mt-10">
          <h2 className="text-3xl font-semibold">لیست خانه های شما</h2>
          {data?.length === 0 ? (
            <NoItems
              title="هنوز خانه ای را در سایت ثبت نکرده اید ..."
              description="میتوانید از منوی کاربری اولین خانه خود را در سایت ثبت کنید"
            />
          ) : (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 mt-8">
              {data?.map((item) => {
                return (
                  <ListingCard
                    key={item?.id}
                    description={item?.description as string}
                    photo={item?.photo as string}
                    country={item?.country as string}
                    city={item?.city as string}
                    title={item?.title as string}
                    price={item?.price as number}
                    userId={user.id}
                    favoriteId={item?.favorite[0]?.id as string}
                    isInFavoriteList={
                      (item?.favorite?.length as number) > 0 ? true : false
                    }
                    homeId={item?.id as string}
                    pathName="/my-homes"
                  />
                );
              })}
            </div>
          )}
        </section>
      )}
    </>
  );
}
export default page;
