"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export type initialStateType = {
  message?: string;
  icon?: string;
  error?: boolean;
  sucsses?: boolean;
  redirect?: string;
  warning?: boolean;
};

type actionFunction = (
  prevState: initialStateType,
  formData: FormData
) => Promise<initialStateType>;

const initialState = {
  message: "",
  icon: "",
  error: false,
  sucsses: false,
  redirect: "",
  warning: false,
};

function FormContainer({
  action,
  children,
}: {
  action: actionFunction;
  children: React.ReactNode;
}) {
  const [state, formAction] = useFormState(action, initialState);

  const router = useRouter();

  useEffect(() => {
    if (state.message && state.icon === "heart") {
      toast(state.message, {
        icon: <Heart className="w-4 h-4" fill="true" />,
      });
    } else if (state.message && state.error) {
      toast.error(state.message);
    } else if (state.message && state.sucsses && state.redirect) {
      toast.success(state.message);
      router.push(state.redirect);
    } else if (state.message && state.sucsses) {
      toast.success(state.message);
    } else if (state.message && state.warning) {
      toast.warning(state.message);
    } else if (state.message) {
      toast(state.message);
    } else if (state.redirect) {
      router.push(state.redirect);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="w-full"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </form>
  );
}
export default FormContainer;
