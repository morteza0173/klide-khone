import ListingCard from "@/components/ListingCard";
import NoItems from "@/components/NoItems";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Card, CardContent } from "@/components/ui/card";
import ToastMessage from "@/components/ToastMessage";

async function getData(userId: string) {
  try {
    const data = await prisma.reservation.findMany({
      where: {
        userId: userId,
      },
      select: {
        Home: {
          select: {
            id: true,
            description: true,
            photo: true,
            country: true,
            city: true,
            title: true,
            price: true,
            favorite: {
              where: {
                userId: userId,
              },
            },
          },
        },
        startDate: true,
        endDate: true,
      },
      orderBy: {
        createdAt: "desc",
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
  if (!user?.id) return redirect("/");
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
          <h2 className="text-3xl font-semibold">لیست رزرو های شما</h2>
          {data?.length === 0 ? (
            <NoItems
              title="شما خانه ای رزرو نکرده اید ..."
              description="هنوز خانه ای رزرو نکرده اید . میتوانید از صفحه اصلی یک خانه را انتخاب و آن را رزرو کنید"
            />
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 mt-8">
              {data?.map((item) => {
                return (
                  <Card key={item.Home?.id}>
                    <CardContent>
                      <div className="flex flex-col mt-4">
                        <ListingCard
                          description={item.Home?.description as string}
                          photo={item.Home?.photo as string}
                          country={item.Home?.country as string}
                          city={item.Home?.city as string}
                          title={item.Home?.title as string}
                          price={item.Home?.price as number}
                          userId={user.id}
                          favoriteId={item.Home?.favorite[0]?.id as string}
                          isInFavoriteList={
                            (item.Home?.favorite?.length as number) > 0
                              ? true
                              : false
                          }
                          homeId={item.Home?.id as string}
                          pathName="/favorites"
                        />
                        <p className="text-xs font-medium col-span-4 bg-muted py-2 rounded text-center mt-2">
                          شما از تاریخ{" "}
                          {new DateObject({
                            date: item.startDate,
                            calendar: persian,
                            locale: persian_fa,
                          }).format()}{" "}
                          تا{" "}
                          {new DateObject({
                            date: item.endDate,
                            calendar: persian,
                            locale: persian_fa,
                          }).format()}{" "}
                          را رزرو کردید .
                        </p>
                      </div>
                    </CardContent>
                  </Card>
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
