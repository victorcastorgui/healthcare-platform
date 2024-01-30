import Button from "@/components/Button/Button";
import DropdownButton from "@/components/Button/DropdownButton";
import Logo from "@/components/Logo/Logo";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { TCart, TUser } from "@/types";
import { getRoleId, getToken, removeRoleId, removeToken } from "@/utils/token";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShoppingCartIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CartItem from "./CartItem";

const Navbar = () => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const cart = useCustomSWR<TCart>(
    roleId === "1" ? `${apiBaseUrl}/cart` : null
  );
  const user = useCustomSWR<TUser>(
    roleId === "1" ? `${apiBaseUrl}/users/profile` : null
  );

  useEffect(() => {
    setToken(getToken());
    setRoleId(getRoleId());
  }, []);

  return (
    <div className="drawer fixed z-50">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-white text-primary-text font-semibold drop-shadow-sm">
        <div className="w-full lg:w-4/5 m-auto max-w-screen-xl navbar py-5">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
                color="#00383F"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <Logo variant="primary" />
          </div>
          <div className="flex-none hidden lg:block">
            <ul className="flex gap-8 text-base items-center">
              {roleId === "2" ? (
                <>
                  <li
                    className={
                      router.pathname === "/doctor" ? "text-primary" : ""
                    }
                  >
                    <Link href={"/doctor"}>Telemedicine</Link>
                  </li>
                  <li
                    className={
                      router.pathname.startsWith("/doctor/profile")
                        ? "text-primary"
                        : ""
                    }
                  >
                    <Link href={"/doctor/profile"}>Profile</Link>
                  </li>
                  <li
                    className="text-[#FF4949] cursor-pointer"
                    onClick={() => {
                      removeToken();
                      removeRoleId();
                      router.push("/auth/login");
                    }}
                  >
                    Logout
                  </li>
                </>
              ) : (
                <>
                  <li className={router.pathname === "/" ? "text-primary" : ""}>
                    <Link href={"/"}>Home</Link>
                  </li>
                  <li
                    className={
                      router.pathname.startsWith("/products")
                        ? "text-primary"
                        : ""
                    }
                  >
                    <Link href={"/products"}>Products</Link>
                  </li>
                  <li
                    className={
                      router.pathname.startsWith("/consultations")
                        ? "text-primary"
                        : ""
                    }
                  >
                    <Link href={"/consultations"}>Consultations</Link>
                  </li>
                </>
              )}

              {token && roleId === "1" && (
                <>
                  <li
                    className={
                      router.pathname.startsWith("/user/chat")
                        ? "text-primary"
                        : ""
                    }
                  >
                    <Link href={"/user/chat"}>Chat</Link>
                  </li>
                  <li className="relative dropdown dropdown-hover dropdown-bottom dropdown-end">
                    <Link href={"/user/cart"}>
                      {cart.data && cart.data.data.total_item !== 0 && (
                        <div className="bg-[#36A5B2] px-[6px] py-[0.75px] rounded-full text-white text-xs top-[2px] right-[-7px] absolute">
                          {cart.data.data.total_item}
                        </div>
                      )}
                      <Button tabIndex={0} role="button" className="pt-2">
                        <ShoppingCartIcon color="#00383F" />
                      </Button>

                      <div
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
                      >
                        {cart.data &&
                          (cart.data.data.total_item !== 0 ? (
                            <div className=" w-72">
                              <div className="text-[#999999] font-medium text-sm my-2">
                                Recently Added Products
                              </div>
                              <div className="max-h-[18rem] overflow-auto scrollbar-custom my-2 mb-5">
                                {cart.data.data.cart_item.map((val, i) => {
                                  return (
                                    <CartItem
                                      key={`cartItemNav-${i}`}
                                      cart={val}
                                    />
                                  );
                                })}
                              </div>
                              <Button
                                variants="primary"
                                onClick={() => router.push("/user/cart")}
                              >
                                View Cart
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col justify-center items-center py-5 w-48">
                              <Image
                                src="https://everhealth-asset.irfancen.com/assets/empty-cart.webp"
                                width={100}
                                height={100}
                                alt="Empty Cart Icon"
                              />
                              <div className="font-semibold">
                                Cart is empty!
                              </div>
                            </div>
                          ))}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <DropdownButton
                      setCustomState={setIsProfileOpen}
                      variants="ghost"
                      size="medium"
                      dropdownTitle={
                        <div className="flex gap-2 items-center">
                          {user.data && (
                            <>
                              <div className="w-8 h-8 avatar rounded-full border border-solid border-[#00383F]">
                                <Image
                                  src={
                                    user.data.image !== ""
                                      ? user.data.image
                                      : "https://everhealth-asset.irfancen.com/assets/avatar-placeholder.png"
                                  }
                                  className="rounded-full"
                                  fill
                                  sizes="100%"
                                  alt={user.data.name}
                                />
                              </div>
                              <p>{user.data.name}</p>
                            </>
                          )}
                          {isProfileOpen ? (
                            <ChevronUpIcon
                              color="#00383F"
                              width={15}
                              height={15}
                            />
                          ) : (
                            <ChevronDownIcon
                              color="#00383F"
                              width={15}
                              height={15}
                            />
                          )}
                        </div>
                      }
                    >
                      <li
                        className={
                          router.pathname.startsWith("/user/order-history")
                            ? "text-primary"
                            : ""
                        }
                      >
                        <Link href={"/user/order-history"}>Order History</Link>
                      </li>
                      <li
                        className={
                          router.pathname.startsWith(
                            "/user/consultation-history"
                          )
                            ? "text-primary"
                            : ""
                        }
                      >
                        <Link href={"/user/consultation-history"}>
                          Consultation History
                        </Link>
                      </li>
                      <li
                        className={
                          router.pathname.startsWith("/user/profile")
                            ? "text-primary"
                            : ""
                        }
                      >
                        <Link href={"/user/profile"}>Profile</Link>
                      </li>
                      <li>
                        <Button
                          onClick={() => {
                            removeToken();
                            removeRoleId();
                            router.push("/auth/login");
                          }}
                        >
                          <p className="text-red-500">Logout</p>
                        </Button>
                      </li>
                    </DropdownButton>
                  </li>
                </>
              )}
              {!token && (
                <>
                  <li
                    className={
                      router.pathname.startsWith("/auth/login")
                        ? "text-primary"
                        : ""
                    }
                  >
                    <Link href={"/auth/login"}>Login</Link>
                  </li>
                  <li
                    className={
                      router.pathname.startsWith("/auth/register")
                        ? "text-primary"
                        : ""
                    }
                  >
                    <Link href={"/auth/register"}>Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side lg:hidden">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="flex flex-col gap-4 p-8 w-80 min-h-screen bg-base-200 font-semibold text-xl">
          <li>
            <label
              htmlFor="my-drawer-3"
              aria-label="close sidebar"
              className="btn btn-square btn-ghost justify-start"
            >
              <ArrowLeftIcon color="#00383F" width={35} height={35} />
            </label>
          </li>
          {token && roleId === "2" ? (
            <>
              <li
                className={router.pathname === "/doctor" ? "text-primary" : ""}
              >
                <Link href={"/doctor"}>Telemedicine</Link>
              </li>
              <li
                className={
                  router.pathname.startsWith("/doctor/profile")
                    ? "text-primary"
                    : ""
                }
              >
                <Link href={"/doctor/profile"}>Profile</Link>
              </li>
              <li
                className="text-[#FF4949] cursor-pointer"
                onClick={() => {
                  removeToken();
                  removeRoleId();
                  router.push("/auth/login");
                }}
              >
                Logout
              </li>
            </>
          ) : (
            <>
              <li
                className={`mt-10 ${
                  router.pathname === "/" ? "text-primary" : ""
                }`}
              >
                <Link href={"/"}>Home</Link>
              </li>
              <li
                className={
                  router.pathname.startsWith("/products") ? "text-primary" : ""
                }
              >
                <Link href={"/products"}>Products</Link>
              </li>
              <li
                className={
                  router.pathname.startsWith("/consultations")
                    ? "text-primary"
                    : ""
                }
              >
                <Link href={"/consultations"}>Consultations</Link>
              </li>
            </>
          )}
          {token && roleId === "1" && (
            <>
              <li>
                <Link href={"/user/cart"} className="flex items-center gap-1">
                  Cart
                  {cart.data && cart.data.data.total_item !== 0 && (
                    <div className="bg-[#36A5B2] px-2 py-[0.25px] rounded-full text-white text-base">
                      {cart.data.data.total_item}
                    </div>
                  )}
                </Link>
              </li>
              <li
                className={
                  router.pathname.startsWith("/user/order-history")
                    ? "text-primary"
                    : ""
                }
              >
                <Link href={"/user/order-history"}>Order History</Link>
              </li>
              <li
                className={
                  router.pathname.startsWith("/user/consultation-history")
                    ? "text-primary"
                    : ""
                }
              >
                <Link href={"/user/consultation-history"}>
                  Consultation History
                </Link>
              </li>
              <li
                className={
                  router.pathname.startsWith("/user/chat") ? "text-primary" : ""
                }
              >
                <Link href={"/user/chat"}>Chat</Link>
              </li>
              <li
                className={
                  router.pathname.startsWith("/user/profile")
                    ? "text-primary"
                    : ""
                }
              >
                <Link href={"/user/profile"}>Profile</Link>
              </li>
              <li>
                <Button
                  onClick={() => {
                    removeToken();
                    removeRoleId();
                    router.push("/auth/login");
                  }}
                >
                  <p className="text-red-500 text-left">Logout</p>
                </Button>
              </li>
            </>
          )}

          {!token && (
            <>
              <li
                className={
                  router.pathname.startsWith("/auth/login")
                    ? "text-primary"
                    : ""
                }
              >
                <Link href={"/auth/login"}>Login</Link>
              </li>
              <li
                className={
                  router.pathname.startsWith("/auth/register")
                    ? "text-primary"
                    : ""
                }
              >
                <Link href={"/auth/register"}>Register</Link>
              </li>
            </>
          )}

          <li className="mt-40">
            {user.data && (
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 avatar rounded-full border border-solid border-[#00383F] overflow-hidden">
                  <Image
                    src={
                      user.data.image !== ""
                        ? user.data.image
                        : "https://everhealth-asset.irfancen.com/assets/avatar-placeholder.png"
                    }
                    fill
                    sizes="100%"
                    alt={`profilePicture-${user.data.name}`}
                  />
                </div>
                <p>{user.data.name}</p>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
