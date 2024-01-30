import { TCartItem } from "@/types";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import Image from "next/image";
import React from "react";

interface ICartItem {
  cart: TCartItem;
}

const CartItem = ({ cart }: ICartItem) => {
  return (
    <div className="flex gap-3 items-center justify-between p-2 borber border-b">
      <div className="flex items-center gap-1">
        <Image src={cart.image} alt={cart.name} width={50} height={50} />
        <div className="font-semibold">{cart.name}</div>
      </div>
      <div className="text-[#36A5B2]">{formatToRupiah(Number(cart.price))}</div>
    </div>
  );
};

export default CartItem;
