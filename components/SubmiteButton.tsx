"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Heart, Loader2 } from "lucide-react";
import { DateObject } from "react-multi-date-picker";

export function SubmiteButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled size="lg">
          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          لطفا صبر کنید
        </Button>
      ) : (
        <Button size="lg">بعدی</Button>
      )}
    </>
  );
}

export function AddToFavoriteButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button
          variant="outline"
          size="icon"
          disabled
          className="bg-primary-foreground"
        >
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="bg-primary-foreground"
          type="submit"
        >
          <Heart className="w-4 h-4" />
        </Button>
      )}
    </>
  );
}
export function DeleteFromFavoriteButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button
          variant="outline"
          size="icon"
          disabled
          className="bg-primary-foreground"
        >
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="bg-primary-foreground"
          type="submit"
        >
          <Heart className="w-4 h-4 text-primary" fill="#E21C49" />
        </Button>
      )}
    </>
  );
}

export function ResevetionSubmiteButton({ values }: { values: DateObject[] }) {
  const { pending } = useFormStatus();
  console.log(values.length);

  return (
    <>
      {pending ? (
        <Button className="w-full mt-4" disabled>
          <Loader2 className="w-4 h-4 animate-spin ml-2" /> لطفا صبر کنید ...
        </Button>
      ) : values.length === 0 ? (
        <Button className="w-full mt-4" disabled>
          یک بازه زمانی انتخاب کنید
        </Button>
      ) : (
        <Button
          className="w-full mt-4"
          type="submit"
          disabled={values.length === 0}
        >
          پرداخت و رزرو
        </Button>
      )}
    </>
  );
}
