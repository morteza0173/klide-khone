import { createCategoryPage } from "@/app/action";
import CreationButtonBar from "@/components/CreationButtonBar";
import { SelectedCategory } from "@/components/SelectedCategory";

export default function StrucutreRoute({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="w-3/5 mx-auto">
        <h2 className="text-3xl font-semibold transition-colors">
          کدوم از اینا میتونه خونه ی تو رو توصیف کنه؟
        </h2>
      </div>
      <form action={createCategoryPage}>
        <input type="hidden" name="homeId" value={params.id} />
        <SelectedCategory />
        <CreationButtonBar />
      </form>
    </>
  );
}
