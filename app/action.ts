"use server";

import { initialStateType } from "@/components/FormContainer";
import prisma from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { homeDetailSchema } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";

export async function createHome(
  _prevState: initialStateType,
  formData: FormData
) {
  const userId = formData.get("userId") as string;
  console.log(userId);

  try {
    const data = await prisma.home.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAT: "desc",
      },
    });

    if (data === null) {
      const data = await prisma.home.create({
        data: {
          userId: userId,
        },
      });
      return { redirect: `/create/${data.id}/structure` };
    } else if (
      !data.addedCategory &&
      !data.addedDescription &&
      !data.addedLoaction
    ) {
      return { redirect: `/create/${data.id}/structure` };
    } else if (data.addedCategory && !data.addedDescription) {
      return { redirect: `/create/${data.id}/description` };
    } else if (
      data.addedCategory &&
      data.addedDescription &&
      !data.addedLoaction
    ) {
      return { redirect: `/create/${data.id}/address` };
    } else if (
      data.addedCategory &&
      data.addedDescription &&
      data.addedLoaction
    ) {
      const data = await prisma.home.create({
        data: {
          userId: userId,
        },
      });
      return { redirect: `/create/${data.id}/structure` };
    }
    return {};
  } catch {
    return { message: "عملیات با خطا مواجه شد", error: true };
  }
}

export async function createCategoryPage(
  _prevState: initialStateType,
  formData: FormData
) {
  try {
    const categoryName = formData.get("categoryName") as string;
    if (!categoryName) {
      throw new Error("باید یک دسته بندی را انتخاب کنید");
    }
    const homeId = formData.get("homeId") as string;
    await prisma.home.update({
      where: {
        id: homeId,
      },
      data: {
        categoryName: categoryName,
        addedCategory: true,
      },
    });
    return { redirect: `/create/${homeId}/description` };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, warning: true };
    }
    return {
      message: "عملیات با خطا مواجه شد",
      error: true,
    };
  }
}

type formDataType = {
  homeId: string;
  title: string;
  description: string;
  price: number;
  image: File;
  guest: string;
  room: string;
  bathroom: string;
};

export async function createDescription(
  _prevState: initialStateType,
  formData: FormData
) {
  try {
    const rawData = Object.fromEntries(formData) as unknown as formDataType;
    console.log(rawData.image.name);
    const validateFields = homeDetailSchema.safeParse(rawData);
    if (!validateFields.success) {
      const error = validateFields.error.errors.map((error) => error.message);
      throw new Error(error.join(" , "));
    }
    const { data: imageData } = await supabase.storage
      .from("images")
      .upload(`${rawData.image?.name}-${new Date()}`, rawData.image, {
        cacheControl: "2592000",
        contentType: "image/png",
      });

    await prisma.home.update({
      where: {
        id: rawData.homeId,
      },
      data: {
        title: rawData.title,
        description: rawData.description,
        price: Number(rawData.price),
        bedrooms: rawData.room,
        bathrooms: rawData.bathroom,
        guests: rawData.guest,
        photo: imageData?.path,
        addedDescription: true,
      },
    });

    return { redirect: `/create/${rawData.homeId}/address` };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, warning: true };
    }
    return {
      message: "عملیات با خطا مواجه شد",
      error: true,
    };
  }
}

export async function createLocation(
  _prevState: initialStateType,
  formData: FormData
) {
  const homeId = formData.get("homeId") as string;
  const country = formData.get("country") as string;
  const city = formData.get("city") as string;
  const address = formData.get("address") as string;
  const lat = formData.get("lat");
  const lng = formData.get("lng");
  try {
    await prisma.home.update({
      where: {
        id: homeId,
      },
      data: {
        country: country,
        city: city,
        address: address,
        lat: lat ? parseFloat(lat as string) : null,
        lng: lng ? parseFloat(lng as string) : null,
        addedLoaction: true,
      },
    });
    return {
      message: "خانه ی شما با موفقیت به لیست اضافه شد",
      sucsses: true,
      redirect: "/",
    };
  } catch {
    return { message: "عملیات با خطا مواجه شد", error: true };
  }
}

export async function addToFavorite(
  _prevState: initialStateType,
  formData: FormData
) {
  const homeId = formData.get("homeId") as string;
  const userId = formData.get("userId") as string;
  const pathName = formData.get("pathName") as string;
  try {
    await prisma.favorite.create({
      data: {
        homeId: homeId,
        userId: userId,
      },
    });
    revalidatePath(pathName);
    return { message: "با موفقیت به لیست علاقه مندی اضافه شد", icon: "heart" };
  } catch {
    return { message: "عملیات با خطا مواجه شد", error: true };
  }
}

export async function deleteFromFavorite(
  _prevState: initialStateType,
  formData: FormData
) {
  const favoriteId = formData.get("favoriteId") as string;
  const userId = formData.get("userId") as string;
  const pathName = formData.get("pathName") as string;
  try {
    await prisma.favorite.delete({
      where: {
        id: favoriteId,
        userId: userId,
      },
    });
    revalidatePath(pathName);
    return { message: "از لیست علاقه مندی حذف شد", icon: "heart" };
  } catch {
    return { message: "عملیات با خطا مواجه شد", error: true };
  }
}

export async function createReservation(
  _prevState: initialStateType,
  formData: FormData
) {
  const userId = formData.get("userId") as string;
  const homeId = formData.get("homeId") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  try {
    await prisma.reservation.create({
      data: {
        userId: userId,
        endDate: endDate,
        startDate: startDate,
        homeId: homeId,
      },
    });
    revalidatePath("/reservetions");
    return {
      message: "خانه با موفقیت رزرو شد",
      sucsses: true,
      redirect: "/reservetions",
    };
  } catch {
    return { message: "عملیات با خطا مواجه شد", error: true };
  }
}
