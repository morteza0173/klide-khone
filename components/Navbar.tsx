import Image from "next/image";
import Link from "next/link";
import desctopLogo from "../public/key-svgrepo-com.svg";
import mobileLogo from "../public/key-svgrepo-com.svg";
import UserNav from "./UserNav";

function Navbar() {
  return (
    <nav className="w-full border-b">
      <div className="flex items-center justify-between container mx-auto px-5 lg:px-10 py-5">
        <Link href="/" className="flex gap-x-4 justify-center items-center">
          <Image
            src={desctopLogo}
            alt="desctop Logo"
            className="w-16 hidden lg:block"
            priority
          />
          <h2 className="hidden lg:block mt-8 text-2xl font-bold">کلید خونه</h2>
          <Image
            src={mobileLogo}
            alt="mobile Logo"
            className="w-12 block lg:hidden"
            priority
          />
        </Link>
        <div className="rounded-full border px-5 py-2">
          <h1>سرچ سایت اینجا قرار میگیرد</h1>
        </div>
        <UserNav />
      </div>
    </nav>
  );
}
export default Navbar;
