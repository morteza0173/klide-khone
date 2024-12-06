import ListingCard from "@/components/ListingCard";
import MapFilterItems from "@/components/MapFilterItems";
import NoItems from "@/components/NoItems";
import SkeletonCard from "@/components/SkeletonCard";
import ToastMessage from "@/components/ToastMessage";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { FilterX } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

async function getData({
  userId,
  searchParams,
}: {
  userId: string | undefined;
  searchParams?: { filter?: string };
}) {
  try {
    const data = await prisma.home.findMany({
      where: {
        addedCategory: true,
        addedDescription: true,
        addedLoaction: true,
        categoryName: searchParams?.filter ?? undefined,
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
          where: { userId: userId ?? undefined },
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

export default function Home({
  searchParams,
}: {
  searchParams?: { filter?: string };
}) {
  return (
    <div className="container mx-auto px-5 lg:px-10">
      <div className="grid grid-cols-12">
        <div className="col-span-10">
          <MapFilterItems />
        </div>
        <div className="col-span-2 flex items-center justify-center">
          <Button asChild className="hidden lg:block" variant="outline">
            <Link href="/" className="text-xs">
              نمایش همه
            </Link>
          </Button>
          <Button asChild className="lg:hidden" variant="outline" size="icon">
            <Link href="/" className="text-xs">
              <FilterX className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Suspense key={searchParams?.filter} fallback={<SkeletonLoading />}>
        <ShowItems searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ShowItems({
  searchParams,
}: {
  searchParams?: { filter?: string };
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData({ searchParams, userId: user?.id });

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
      {data?.length === 0 ? (
        <NoItems
          title="خانه ای پیدا نشد ..."
          description="لطفا دسته بندی دیگری را بررسی کنید یا خانه خود را اینجا اضافه کنید !"
        />
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 mt-8">
          {data?.map((item) => {
            return (
              <ListingCard
                key={item.id}
                description={item.description as string}
                photo={item.photo as string}
                country={item.country as string}
                city={item.city as string}
                title={item.title as string}
                price={item.price as number}
                userId={user?.id}
                favoriteId={item.favorite[0]?.id}
                isInFavoriteList={item.favorite?.length > 0 ? true : false}
                homeId={item.id}
                pathName="/"
              />
            );
          })}
        </div>
      )}
    </>
  );
}

function SkeletonLoading() {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 mt-8">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
