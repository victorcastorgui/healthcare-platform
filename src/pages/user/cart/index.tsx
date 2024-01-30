import React from "react";
import Head from "next/head";
import CartItem from "@/components/Cart/CartItem";
import Button from "@/components/Button/Button";
import Spinner from "@/components/Loading/Spinner";
import { TCart } from "@/types";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { useFetch } from "@/hooks/useFetch";
import { getToken } from "@/utils/token";
import { toast } from "sonner";
import { useRouter } from "next/router";

const Cart = () => {
  const cart = useCustomSWR<TCart>(`${apiBaseUrl}/cart`);
  const { fetchData: deleteCartItem } = useFetch();
  const { fetchData: updateQuantity } = useFetch();
  const { fetchData: checkItem } = useFetch();
  let allChecked = false;
  const token = getToken();
  const router = useRouter();

  if (cart.data && cart.data.data.cart_item !== null) {
    allChecked = cart.data.data.cart_item.every((item) => item.is_checked);
  }

  const handleDelete = async (id: number) => {
    await deleteCartItem(`${apiBaseUrl}/cart/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Delete success!");
    cart.mutate();
  };

  const handleIncreaseQty = async (id: number, qty: number) => {
    qty++;

    await updateQuantity(`${apiBaseUrl}/cart/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        qty,
      }),
    });
    cart.mutate();
  };

  const handleDecreaseQty = async (id: number, qty: number) => {
    qty--;

    await updateQuantity(`${apiBaseUrl}/cart/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        qty,
      }),
    });
    cart.mutate();
  };

  const checkItemCart = async (id: number, is_check: boolean) => {
    await checkItem(`${apiBaseUrl}/cart/check/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        is_check,
      }),
    });
    cart.mutate();
  };

  const checkAllCart = async (is_check: boolean) => {
    await checkItem(`${apiBaseUrl}/cart/check-all`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        is_check,
      }),
    });
    cart.mutate();
  };

  return (
    <>
      <Head>
        <title>Cart</title>
      </Head>
      <section className="max-w-screen-xl w-11/12 lg:w-4/5 mx-auto pt-24 pb-14">
        <h2 className="font-bold text-3xl mt-5">Cart</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-start mt-5">
          <section className="bg-white col-span-2 rounded-xl shadow overflow-auto scroll-smooth scrollbar-custom">
            {cart.isLoading && (
              <div className="w-full mx-auto py-36">
                <Spinner />
              </div>
            )}

            {cart.data && (
              <CartItem
                cart={cart.data.data.cart_item}
                allChecked={allChecked}
                handleDelete={handleDelete}
                handleIncreaseQty={handleIncreaseQty}
                handleDecreaseQty={handleDecreaseQty}
                checkCartItem={checkItemCart}
                checkAllCart={checkAllCart}
              />
            )}
          </section>

          <section className="col-span-2 sm:col-span-1 bg-white rounded-xl shadow px-6 py-4 sticky top-28">
            <div className="font-bold text-xl">Total</div>
            <hr className="h-px mt-2 bg-gray-200 border-0"></hr>

            <div className="flex justify-between mt-4">
              <div className="font-semibold">Subtotal</div>
              <div className="font-semibold text-[#999999]">
                {cart.data &&
                  (cart.data.data.total_amount !== "0"
                    ? formatToRupiah(Number(cart.data.data.total_amount))
                    : "-")}
              </div>
            </div>

            <div className="font-thin text-xs md:text-sm  text-[#999999] mt-3 mb-4">
              To get shipping cost you must process cart to checkout
            </div>

            <Button
              variants="primary"
              disabled={cart.data?.data.total_amount === "0"}
              onClick={() => router.push("/user/checkout")}
            >
              Checkout
            </Button>
          </section>
        </div>
      </section>
    </>
  );
};

export default Cart;
