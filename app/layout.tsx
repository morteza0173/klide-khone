import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Vazirmatn } from "next/font/google";

const vazirmatn = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "رزرو خونه",
  description: "خونه ی رویایی خودتو رزرو کن",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl">
      <body className={`${vazirmatn.className} antialiased`}>
        <Toaster
          dir="rtl"
          position="bottom-left"
          expand={false}
          richColors
          closeButton
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
