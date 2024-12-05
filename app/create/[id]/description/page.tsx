import { createDescription } from "@/app/action";
import Counter from "@/components/Counter";
import CreationButtonBar from "@/components/CreationButtonBar";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function DescriptionPage({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="w-[90%] lg:w-3/5 mx-auto">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold transition-colors">
          لطفا مشخصات خانه را پر کنید
        </h2>
      </div>
      <form action={createDescription}>
        <input type="hidden" name="homeId" value={params.id} />
        <div className="mx-auto w-[90%] lg:w-3/5 mt-10 flex flex-col gap-y-5 mb-36">
          <div className="flex flex-col gap-y-2">
            <Label>موضوع</Label>
            <Input
              name="title"
              type="text"
              placeholder="کوتاه و مختصر ..."
              required
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>توضیحات</Label>
            <Textarea
              name="description"
              required
              placeholder="لطفا در مورد خونه ی خودتون بنویسید ... "
              className="h-24"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>قیمت</Label>
            <Input
              name="price"
              required
              type="number"
              placeholder="قیمت به ازای هر شب به تومان"
              min={50000}
              step={5000}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>تصویر</Label>
            <Input name="image" required type="file" />
          </div>
          <Card>
            <CardHeader className="flex flex-col gap-y-5">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">مهمان ها</h3>
                  <p className="text-muted-foreground text-sm">
                    چه تعداد مهمان قبول میکنید ؟
                  </p>
                </div>
                <Counter name="guest" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">اتاق ها</h3>
                  <p className="text-muted-foreground text-sm">
                    چند اتاق دارید؟
                  </p>
                </div>
                <Counter name="room" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">سرویس بهداشتی ها</h3>
                  <p className="text-muted-foreground text-sm">
                    چه تعداد حمام و سرویس بهداشتی دارید؟
                  </p>
                </div>
                <Counter name="bathroom" />
              </div>
            </CardHeader>
          </Card>
        </div>
        <CreationButtonBar />
      </form>
    </>
  );
}
export default DescriptionPage;
