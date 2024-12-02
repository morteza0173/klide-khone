import { Search } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import MapSearchComponent from "./MapSearchComponent";
import prisma from "@/lib/db";

async function getData() {
  const data = await prisma.home.findMany({
    where: {
      addedCategory: true,
      addedDescription: true,
      addedLoaction: true,
    },
    select: {
      photo: true,
      title: true,
      price: true,
      lat: true,
      lng: true,
      id: true,
    },
  });
  return data;
}

async function SearchComponent() {
  const data = await getData();

  return (
    <Drawer handleOnly>
      <DrawerTrigger asChild>
        <div className="rounded-full py-2 pr-5 pl-2 border flex items-center justify-between cursor-pointer divide-x gap-x-4 ">
          <p>جستجو از روی نقشه</p>
          <Search className="w-8 h-8 p-1 rounded-full bg-primary text-white" />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex justify-center">
            <p>یک خانه از روی نقشه انتخاب کنید</p>
          </DrawerTitle>
        </DrawerHeader>
        <MapSearchComponent data={data} />
      </DrawerContent>
    </Drawer>
  );
}
export default SearchComponent;
