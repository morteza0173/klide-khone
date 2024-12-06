import CategoryShowcase from "@/components/CategoryShowcase";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/db";
import { BedDouble, MapPinHouse, Toilet, User } from "lucide-react";
import Image from "next/image";
import "leaflet/dist/leaflet.css";
import SelectCalender from "@/components/SelectCalender";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  addToFavorite,
  createReservation,
  deleteFromFavorite,
} from "@/app/action";
import {
  AddToFavoriteButton,
  DeleteFromFavoriteButton,
} from "@/components/SubmiteButton";
import FormContainer from "@/components/FormContainer";
import ToastMessage from "@/components/ToastMessage";

interface positionType {
  lng: number;
  lat: number;
}

async function getData({
  homeId,
  userId,
}: {
  homeId: string;
  userId?: string;
}) {
  try {
    const data = await prisma.home.findUnique({
      where: {
        id: homeId,
      },
      select: {
        photo: true,
        description: true,
        guests: true,
        bedrooms: true,
        bathrooms: true,
        title: true,
        categoryName: true,
        price: true,
        country: true,
        city: true,
        address: true,
        lat: true,
        lng: true,
        Reservation: {
          where: {
            homeId: homeId,
          },
        },
        User: {
          select: {
            profileImage: true,
            firstName: true,
          },
        },
        favorite: userId
          ? {
              where: { userId: userId, homeId: homeId },
            }
          : false,
      },
    });
    return data;
  } catch {
    return undefined;
  }
}

export default async function HomeRoute({
  params,
}: {
  params: { id: string };
}) {
  const Map = dynamic(() => import("@/components/MapInHomeId"), {
    ssr: false,
    loading: () => <Skeleton className="h-[50vh] w-full" />,
  });
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const data = await getData({ homeId: params.id, userId: user.id });
  const latNumber = data?.lat;
  const lngNumber = data?.lng;
  const position = { lng: lngNumber, lat: latNumber };

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
        <div className="w-[90%]  mx-auto mt-10 mb-12">
          <div className="flex gap-x-4 justify-between">
            <h1 className="text-lg lg:text-2xl font-bold mb-5">
              {data?.title}
            </h1>
            <div>
              {user.id && (
                <div>
                  {data?.favorite && data?.favorite?.length > 0 ? (
                    <FormContainer action={deleteFromFavorite}>
                      <input
                        type="hidden"
                        name="favoriteId"
                        value={data?.favorite[0]?.id}
                      />
                      <input type="hidden" name="userId" value={user.id} />
                      <input
                        type="hidden"
                        name="pathName"
                        value={`/home/${params.id}`}
                      />
                      <DeleteFromFavoriteButton />
                    </FormContainer>
                  ) : (
                    <FormContainer action={addToFavorite}>
                      <input type="hidden" name="homeId" value={params.id} />
                      <input type="hidden" name="userId" value={user.id} />
                      <input
                        type="hidden"
                        name="pathName"
                        value={`/home/${params.id}`}
                      />
                      <AddToFavoriteButton />
                    </FormContainer>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="relative h-[550px]">
            <Image
              alt={data?.title as string}
              src={`https://bymduyiqpqrwlrojytxs.supabase.co/storage/v1/object/public/images/${data?.photo}`}
              fill
              className="object-cover rounded-lg w-full h-full"
            />
          </div>
          <div className="flex justify-between gap-x-24 mt-8 flex-col-reverse lg:flex-row">
            <div className="w-full lg:w-[90%]">
              <div className="flex gap-x-4">
                <MapPinHouse className="w-6 h-6" />
                <h3 className="text-xl font-medium ">
                  {data?.country} ، {data?.city}
                </h3>
              </div>

              <div className="flex gap-x-4 gap-y-2 text-muted-foreground flex-wrap justify-between mt-2">
                <div className="flex items-center">
                  <User /> <p>تعداد مهمان ها : {data?.guests}</p>
                </div>
                <div className="flex items-center gap-x-1">
                  <BedDouble />
                  <p>تعداد اتاق خواب : {data?.bedrooms}</p>
                </div>
                <div className="flex items-center gap-x-1">
                  <Toilet />
                  <p>تعداد سرویس بهداشتی : {data?.bathrooms}</p>
                </div>
              </div>
              <div className="flex items-center mt-6">
                <img
                  src={
                    data?.User?.profileImage &&
                    typeof data?.User?.profileImage === "string" &&
                    !data?.User?.profileImage.includes("d=blank")
                      ? data?.User?.profileImage
                      : "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  alt="user host"
                  className="w-11 h-11 rounded-full"
                />
                <div className="flex flex-col mr-4">
                  <h3 className="font-medium">
                    میزبانی توسط {data?.User?.firstName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    میزبانی از تاریخ 2024
                  </p>
                </div>
              </div>
              <Separator className="my-7" />
              <CategoryShowcase categoryName={data?.categoryName as string} />
              <Separator className="my-7" />
              <p className="text-muted-foreground">{data?.description}</p>
              <Separator className="my-7" />
              <div className="flex items-center mb-4">
                <MapPinHouse className="w-6 h-6" />
                <p className="mr-4">آدرس خانه : {data?.address}</p>
              </div>
              <Map position={position as positionType} />
            </div>
            <div className="mb-10">
              <FormContainer action={createReservation}>
                <input type="hidden" name="homeId" value={params.id} />
                <input type="hidden" name="userId" value={user?.id} />
                <p className="my-2 text-sm text-muted-foreground font-bold">
                  روزهای کمرنگ به‌ معنای رزرو‌شده و غیرقابل انتخاب هستند.
                </p>
                <SelectCalender
                  resevation={data?.Reservation}
                  price={data?.price as number}
                  userId={user?.id}
                />
              </FormContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
