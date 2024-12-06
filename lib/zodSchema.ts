import { z } from "zod";

export const homeDetailSchema = z.object({
  title: z
    .string()
    .min(4, { message: "موضوع باید بیشتر از 4 حرف باشد" })
    .max(20, { message: "موضوع نباید بیشتر از 20 حرف باشد" }),
  description: z.string().refine(
    (description) => {
      const worldCount = description.split(" ").length;
      return worldCount >= 10 && worldCount <= 1000;
    },
    { message: "توضیحات باید بین 10 تا 1000 کلمه باشد" }
  ),
  price: z.coerce
    .number()
    .int()
    .min(50000, { message: "قیمت باید حداقل 50 هزار تومن باشد" }),
  image: validateImage(),
});

function validateImage() {
  const maxUploadSize = 1024 * 1024 * 4;
  const acceptedFileType = ["image/"];
  return z
    .instanceof(File)
    .refine(
      (file) => {
        return !file || file.size <= maxUploadSize;
      },
      { message: '"حجم تصویر نباید بیشتر از 4 مگابایت باشد"' }
    )
    .refine(
      (file) => {
        return (
          !file || acceptedFileType.some((type) => file.type.startsWith(type))
        );
      },
      { message: '"فایلی که برای آپلود انتخاب کردید تصویر نیست"' }
    );
}
