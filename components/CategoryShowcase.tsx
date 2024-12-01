import { categoryItems } from "@/lib/categoryItems";
import Image from "next/image";

function CategoryShowcase({ categoryName }: { categoryName: string }) {
  const category = categoryItems.find((item) => categoryName === item.name);
  return (
    <div className="flex items-center">
      <Image
        src={category?.imageUrl as string}
        alt="category image"
        width={44}
        height={44}
      />
      <div className="flex flex-col mr-4">
        <h3 className="font-medium">{category?.title}</h3>
        <p className="text-sm text-muted-foreground">{category?.description}</p>
      </div>
    </div>
  );
}
export default CategoryShowcase;
