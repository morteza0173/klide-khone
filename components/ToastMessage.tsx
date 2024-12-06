"use client";

import { useEffect } from "react";
import { toast } from "sonner";

function ToastMessage({ message }: { message: string }) {
  useEffect(() => {
    if (message) {
      toast.error(message, { id: "unique-toast" });
    }
  }, []);
  return <></>;
}
export default ToastMessage;
