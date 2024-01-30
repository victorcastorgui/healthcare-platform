import { removeRoleId, removeToken } from "@/utils/token";
import {
  ArrowLeftToLine,
  Barcode,
  ClipboardList,
  Home,
  Menu,
  PackageSearch,
  Pill,
  Stethoscope,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";

function SideBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { push } = useRouter();
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
              router.pathname === "/admin/super" ? "text-primary-text" : ""
            }`}
          >
            <Home />
            <Link href={"/admin/super"}>Home</Link>
          </li>
          <li
            className={`flex gap-2 cursor-pointer hover:text-primary-text ${
              router.pathname.startsWith("/admin/super/product-category")
                ? "text-primary-text"
                : ""
            }`}
          >
            <Barcode />
            <Link href={"/admin/super/product-category"}>Product Category</Link>
          </li>
          <li
            className={`flex gap-2 cursor-pointer hover:text-primary-text ${
              router.pathname.startsWith("/admin/super/product-list")
                ? "text-primary-text"
                : ""
            }`}
          >
            <PackageSearch />
            <Link href={"/admin/super/product-list"}>Product List</Link>
          </li>
          <li
            className={`flex gap-2 cursor-pointer hover:text-primary-text ${
              router.pathname.startsWith("/admin/super/manage-user")
                ? "text-primary-text"
                : ""
            }`}
          >
            <Users />
            <Link href={"/admin/super/manage-user"}>Users</Link>
          </li>
          <li
            className={`flex gap-2 cursor-pointer hover:text-primary-text ${
              router.pathname.startsWith("/admin/super/order")
                ? "text-primary-text"
                : ""
            }`}
          >
            <ClipboardList />
            <Link href={"/admin/super/order"}>Orders</Link>
          </li>
          <li
            className={`flex gap-2 cursor-pointer hover:text-primary-text ${
              router.pathname.startsWith("/admin/super/pharmacies")
                ? "text-primary-text"
                : ""
            }`}
          >
            <Pill />
            <Link href={"/admin/super/pharmacies"}>Pharmacies</Link>
          </li>
          <li
            className={`flex gap-2 cursor-pointer hover:text-primary-text ${
              router.pathname.startsWith("/admin/super/doctor-specialization")
                ? "text-primary-text"
                : ""
            }`}
          >
            <Stethoscope />
            <Link href={"/admin/super/doctor-specialization"}>
              Doctor Specialization
            </Link>
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
}

export default SideBar;
