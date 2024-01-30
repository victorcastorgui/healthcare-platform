import { TCartItem } from "@/types";
import Button from "../Button/Button";
import { Trash2 } from "lucide-react";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { useState } from "react";
import Image from "next/image";
import DeleteModal from "../Modal/DeleteModal";

interface ICartItem {
  cart: TCartItem[];
  allChecked: boolean;
  handleDelete: (id: number) => Promise<void>;
  handleIncreaseQty: (id: number, qty: number) => Promise<void>;
  handleDecreaseQty: (id: number, qty: number) => Promise<void>;
  checkCartItem: (id: number, is_check: boolean) => Promise<void>;
  checkAllCart: (is_check: boolean) => Promise<void>;
}

const CartItem = ({
  cart,
  allChecked,
  handleDelete,
  handleIncreaseQty,
  handleDecreaseQty,
  checkCartItem,
  checkAllCart,
}: ICartItem): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TCartItem>();

  return (
    <table className="table pb-4">
      <thead className="text-sm">
        <tr className="*:py-6 *:font-bold *:border-b-2">
          <th>
            {cart !== null && (
              <input
                type="checkbox"
                className="checkbox checkbox-xs md:checkbox-sm"
                name="all"
                checked={allChecked}
                onChange={(e) => checkAllCart(e.target.checked)}
              />
            )}
          </th>
          <th className="min-w-32"></th>
          <th>Name</th>
          <th>Unit Price</th>
          <th>Quantity</th>
          <th>Item Subtotal</th>
          <th className=""></th>
        </tr>
      </thead>
      <tbody className="text-sm overflow-x-auto">
        {cart !== null ? (
          cart.map((val, i) => {
            return (
              <tr key={`cartItem-${i}`} className="*:py-8 *:border-b">
                <td>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs md:checkbox-sm"
                    checked={val.is_checked}
                    onChange={(e) => checkCartItem(val.id, e.target.checked)}
                  />
                </td>
                <td>
                  <Image
                    src={val.image}
                    alt={val.name}
                    width={150}
                    height={150}
                  />
                </td>
                <td>
                  {val.name} {val.unit_in_pack}
                </td>
                <td>{formatToRupiah(Number(val.price))}</td>
                <td>
                  <div className="flex items-center max-h-fit gap-2">
                    <Button
                      className="btn btn-outline btn-primary px-1.5 py-1 h-fit min-h-fit hover:!text-[#F2F3F9] disabled:border-gray-400 disabled:bg-white disabled:to-gray-400"
                      onClick={() => handleDecreaseQty(val.id, val.qty)}
                      disabled={val.qty === 1}
                    >
                      -
                    </Button>
                    {val.qty}
                    <Button
                      className="btn btn-outline btn-primary px-1.5 py-1 h-fit min-h-fit hover:!text-[#F2F3F9]"
                      onClick={() => handleIncreaseQty(val.id, val.qty)}
                    >
                      +
                    </Button>
                  </div>
                </td>
                <td className="font-semibold ">
                  {formatToRupiah(Number(val.sub_total))}
                </td>
                <td>
                  <Trash2
                    className="cursor-pointer"
                    color="#FF4949"
                    onClick={() => {
                      setSelectedProduct(val);
                      setIsModalOpen(true);
                    }}
                  />
                </td>
              </tr>
            );
          })
        ) : (
          <>
            <tr>
              <td colSpan={6} className="pt-6 pb-10">
                <div className="flex justify-center items-center">
                  <Image
                    src="https://everhealth-asset.irfancen.com/assets/empty-cart.webp"
                    width={200}
                    height={200}
                    alt="Empty Cart Icon"
                  />
                </div>
                <div className="text-center font-semibold text-xl">
                  Cart is empty!
                </div>

                <div className="text-center font-thin text-[#999999] text-sm mt-3">
                  You must add product to cart to process to checkout
                </div>
              </td>
            </tr>
          </>
        )}
      </tbody>

      {selectedProduct && (
        <DeleteModal
          isOpen={isModalOpen}
          id={selectedProduct.id}
          name={selectedProduct.name}
          setIsModalOpen={() => setIsModalOpen(false)}
          handleDelete={handleDelete}
        />
      )}
    </table>
  );
};

export default CartItem;
