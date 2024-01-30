import Button from "@/components/Button/Button";
import Logo from "@/components/Logo/Logo";
import {
  ArrowLeftRight,
  ArrowLeftToLine,
  BookDown,
  ClipboardList,
  Home,
  Menu,
  PackageSearch,
  Pill,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { removeRoleId, removeToken } from "@/utils/token";

const PharmacySidebar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? "hidden translate-x-5" : "hidden lg:fixed"
        } bg-primary top-8 left-8 rounded-lg transition-all duration-300 max-lg:fixed h-12 w-12 max-lg:flex justify-center items-center z-10`}
      >
        <Menu className="w-10 h-10 text-white" />
      </button>
      <div
        className={`${
          isOpen ? "" : " max-lg:-translate-x-full"
        } max-lg:z-[9] max-lg:fixed transition-all duration-300 max-lg:bg-gradient-to-b max-lg:from-primary max-lg:via-primary max-lg:to-[#A5D0D4] max-lg:w-64 py-24 px-4 flex relative flex-col justify-between items-center h-screen max-w-80 w-[25%]`}
      >
        <Logo variant="tertiary" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden absolute top-9 left-[14.5rem] h-12 w-12 bg-secondary rounded-lg flex justify-center items-center ${
            !isOpen && "hidden"
          }`}
        >
          <ArrowLeftToLine className="w-10 h-10 text-neutral" />
        </button>
        <ul className="flex flex-col gap-12 text-[#F2F3F9] font-semibold">
          <li
            className={`flex gap-2 cursor-pointer hover:text-primary-text ${
              router.pathname === "/admin/pharmacy" ? "text-primary-text" : ""
            }`}
          >
            <Home />
            <Link href={"/admin/pharmacy"}>Home</Link>
          </li>
          <li
            className={`flex gap-2 cursor-pointer hover:text-primary-text ${
              router.pathname.startsWith("/admin/pharmacy/pharmacies")
                ? "text-primary-text"
                : ""
            }`}
          >
            <Pill />
            <Link href={"/admin/pharmacy/pharmacies"}>Pharmacies</Link>
          </li>
          <li
            className={`flex gap-2 cursor-pointer hover:text-primary-text ${
              router.pathname.startsWith("/admin/pharmacy/products")
                ? "text-primary-text"
                : ""
            }`}
          >
            <PackageSearch />
            <Link href={"/admin/pharmacy/products"}>Products</Link>
          </li>
          <li
            className={`flex gap-2 cursor-pointer hover:text-primary-text ${
              router.pathname.startsWith("/admin/pharmacy/stock-mutation")
                ? "text-primary-text"
                : ""
            }`}
          >
            <ArrowLeftRight />
            <Link href={"/admin/pharmacy/stock-mutation"}>Stock Mutation</Link>
          </li>
          <li
            className={`flex gap-2 cursor-pointer hover:text-primary-text ${
              router.pathname.startsWith("/admin/pharmacy/stock-record")
                ? "text-primary-text"
                : ""
            }`}
          >
            <ClipboardList />
            <Link href={"/admin/pharmacy/stock-record"}>Stock Record</Link>
          </li>
          <li
            className={`flex gap-2 cursor-pointer hover:text-primary-text ${
              router.pathname.startsWith("/admin/pharmacy/order")
                ? "text-primary-text"
                : ""
            }`}
          >
            <BookDown />
            <Link href={"/admin/pharmacy/order"}>Orders</Link>
          </li>
        </ul>
        <Button
          variants="primary"
          onClick={() => {
            removeToken();
            removeRoleId();
            router.push("/auth/login");
          }}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default PharmacySidebar;
