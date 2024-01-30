import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Button from "@/components/Button/Button";
import Spinner from "@/components/Loading/Spinner";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import {
  ResponseError,
  TAddress,
  TData,
  TOrderItemAll,
  TShippingMethod,
} from "@/types";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { getToken } from "@/utils/token";
import BaseCard from "@/components/Card/BaseCard";
import FormAddress from "@/components/Address/FormAddress";

interface TPostOrder {
  order_id: number;
}

const Checkout = () => {
  const [shipping, setShipping] = useState<TShippingMethod | null>(null);
  const [isSelectedAddress, setIsSelectedAddress] = useState(true);
  const [isChangeAddress, setIsChangeAddress] = useState(false);
  const [bank, setBank] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState<TAddress | null>(null);

  const address = useCustomSWR<TData<TAddress[]>>(`${apiBaseUrl}/addresses`);
  const shippingMethod = useCustomSWR<TData<TShippingMethod[]> & ResponseError>(
    deliveryAddress
      ? `${apiBaseUrl}/shipping-method/${deliveryAddress.id}`
      : null
  );
  const order = useCustomSWR<TData<TOrderItemAll> & ResponseError>(
    deliveryAddress ? `${apiBaseUrl}/order/items/${deliveryAddress.id}` : null
  );
  const { data: newOrder, fetchData: createOrder } =
    useFetch<TData<TPostOrder>>();

  const totalOrder =
    (order.data && order.data.data ? Number(order.data.data.total_amount) : 0) +
    (shipping ? Number(shipping.cost) : 0);

  const router = useRouter();
  const token = getToken();

  useEffect(() => {
    if (address.data && address.data.data) {
      const tes = address.data.data.filter((val) => val.is_default);
      setDeliveryAddress(tes[0]);
    }
  }, [address.data]);

  useEffect(() => {
    if (newOrder && typeof newOrder !== "string" && newOrder.data) {
      router.push(`/user/payment/${newOrder.data.order_id}`);
    }

    if (
      order.data &&
      "error" in order.data &&
      order.data.error[0] === "no item in cart"
    ) {
      toast.error("Cart is empty. We will navigate you to page cart.");
      router.push("/user/cart");
    }
  }, [newOrder, order]);

  const handleOrder = async () => {
    if (deliveryAddress && shipping && bank) {
      await createOrder(`${apiBaseUrl}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address_id: deliveryAddress.id,
          shipping_name: shipping.name,
          shipping_cost: shipping.cost,
          shipping_eta: shipping.duration,
          payment_method: bank,
        }),
      });
    } else {
      const error: string[] = [];
      if (!shipping) error.push("Choose shipping method");
      if (!deliveryAddress) error.push("Input delivery address");
      if (!bank) error.push("Choose payment method");
      toast.error(error.join(", "));
    }
  };

  return (
    <>
      <Head>
        <title>Checkout</title>
      </Head>
      <div className="max-w-screen-xl mx-3 sm:mx-auto pt-24 pb-12">
        <div className="bg-white px-5 py-4 max-w-fit rounded-xl mt-8">
          <h2 className="font-bold text-3xl text-[#36A5B2]">Checkout</h2>
        </div>
        <section className="bg-white rounded-lg shadow-lg px-6 py-4 mt-6">
          <div className="flex gap-2 font-semibold text-2xl text-[#36A5B2]">
            <MapPin /> Delivery Address
          </div>

          {address.data && deliveryAddress ? (
            <div className="flex items-center justify-between flex-col md:flex-row gap-6 my-3">
              <div className="font-semibold">
                {deliveryAddress.name} ({deliveryAddress.phone})
              </div>
              <div className="flex items-center gap-4 uppercase text-[#999999]">
                {deliveryAddress.street} {deliveryAddress.detail}{" "}
                {deliveryAddress.province}, {deliveryAddress.city}, ID{" "}
                {deliveryAddress.postal_code}
                {deliveryAddress.is_default && (
                  <span className="lowercase bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-1 rounded-lg">
                    main
                  </span>
                )}
              </div>

              <div>
                <Button
                  variants="secondary"
                  onClick={() => setIsChangeAddress(true)}
                >
                  Change
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-5 my-4">
              No address
              <div className="max-w-fit">
                <Button
                  variants="secondary"
                  onClick={() => {
                    setIsSelectedAddress(false);
                    setIsChangeAddress(true);
                  }}
                >
                  Add address
                </Button>
              </div>
            </div>
          )}
        </section>

        {isChangeAddress &&
          (isSelectedAddress ? (
            <section className="bg-white rounded-lg shadow-lg p-6 mt-4">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-2xl">My Address</div>
                <div className="max-w-fit">
                  <Button
                    variants="secondary"
                    onClick={() => setIsSelectedAddress(false)}
                  >
                    + Add Address
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-3 max-h-64 border-y overflow-y-auto scrollbar-custom">
                {address.data &&
                  address.data.data?.map((val, i) => {
                    return (
                      <div key={`address-${i}`}>
                        <input
                          type="radio"
                          id={val.id ? String(val.id) : "-"}
                          name="addressUser"
                          defaultValue={val.id}
                          className="hidden peer"
                          checked={deliveryAddress?.id === val.id}
                          onChange={() => setDeliveryAddress(val)}
                        />
                        <label
                          htmlFor={val.id ? String(val.id) : "-"}
                          className="bg-white rounded-3xl px-6 py-8 drop-shadow flex flex-col w-full border border-gray-200 cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
                        >
                          <div className="flex justify-between">
                            <div className="font-semibold">
                              {val.name}
                              <span className="font-normal">
                                {" "}
                                ({val.phone})
                              </span>
                            </div>
                            {val.is_default && (
                              <div className="flex justify-center items-center">
                                <span className=" bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-1 rounded-lg">
                                  Main
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="text-sm font-light mt-2">
                            {val.street} {val.detail}
                          </div>
                          <div className="text-sm font-light mt-2">
                            {val.city}, {val.province}, {val.postal_code}
                          </div>
                        </label>
                      </div>
                    );
                  })}
              </div>

              <div className="flex gap-5 max-w-fit mt-6">
                <Button
                  variants="secondary"
                  onClick={() => setIsChangeAddress(false)}
                >
                  Cancel
                </Button>
              </div>
            </section>
          ) : (
            <section className="bg-white rounded-lg shadow-lg p-6 mt-4">
              <div className="font-semibold text-2xl">Add Address</div>
              <FormAddress
                initialState={{
                  name: "",
                  street: "",
                  postal_code: "",
                  phone: "",
                  detail: "",
                  latitude: "-6.2304177",
                  longitude: "106.8236458",
                  province_id: 0,
                  city_id: 0,
                  is_default: false,
                }}
                setBack={() => setIsSelectedAddress(true)}
              />
            </section>
          ))}

        <section className="bg-white rounded-lg shadow-lg p-6 mt-4">
          <div className="font-semibold text-2xl">Shipping Category</div>
          <div className="grid w-full gap-3 md:grid-cols-5 mt-5 mb-3">
            {shippingMethod.isLoading && <Spinner />}
            {shippingMethod.data && shippingMethod.data.error && (
              <div className="col-span-3 text-lg mt-2 text-[#999999]">
                Sorry, {shippingMethod.data.error}
              </div>
            )}
            {shippingMethod.data &&
              !shippingMethod.isLoading &&
              shippingMethod.data.data &&
              shippingMethod.data.data.map((val, i) => {
                return (
                  <div key={`shipping-${i}`}>
                    <input
                      type="radio"
                      id={val.name}
                      name="shippingCategory"
                      defaultValue={val.name}
                      className="hidden peer"
                      checked={
                        shipping
                          ? val.name === shipping.name
                            ? true
                            : false
                          : false
                      }
                      onChange={() => {
                        setShipping(val);
                      }}
                    />
                    <label
                      htmlFor={val.name}
                      className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
                    >
                      <div className="block">
                        <div className="w-full text-lg font-semibold uppercase">
                          {val.name}
                        </div>
                        <div className="w-full text-sm">
                          Arrived time: {val.duration}
                        </div>
                        <div className="w-full text-sm">
                          Cost: {formatToRupiah(Number(val.cost))}
                        </div>
                      </div>
                    </label>
                  </div>
                );
              })}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-lg px-6 py-4 mt-4">
          <div className="font-semibold text-2xl">Products Ordered</div>

          <div className="overflow-x-auto mt-3">
            <table className="table">
              {order.data && !order.data.error ? (
                <thead className="text-sm">
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                    <th>Item Subtotal</th>
                  </tr>
                </thead>
              ) : null}

              <tbody>
                {order.data &&
                  (order.data.error ? (
                    <tr className="border-0">
                      <td
                        colSpan={5}
                        className="flex flex-col justify-center items-center text-[#999999] text-lg"
                      >
                        <Image
                          src="https://everhealth-asset.irfancen.com/assets/not-found.webp"
                          width={300}
                          height={200}
                          alt="Sorry logo"
                        />
                        Sorry, {order.data.error}
                      </td>
                    </tr>
                  ) : (
                    order.data &&
                    order.data.data?.order_item.map((val, i) => {
                      return (
                        <tr key={`cartItem-${i}`}>
                          <td>
                            <Image
                              src={val.image}
                              alt={val.name}
                              width={150}
                              height={150}
                            />
                          </td>
                          <td>{val.name}</td>
                          <td>{formatToRupiah(Number(val.price))}</td>
                          <td>{val.qty}</td>
                          <td className="font-semibold">
                            {formatToRupiah(Number(val.sub_total))}
                          </td>
                        </tr>
                      );
                    })
                  ))}
              </tbody>

              {order.data && !order.data.error && order.data.data ? (
                <tfoot className="text-lg">
                  <tr>
                    <th colSpan={4} className="text-right font-semibold">
                      Total
                    </th>
                    <th className="font-semibold">
                      {formatToRupiah(Number(order.data.data.total_amount))}
                    </th>
                  </tr>
                </tfoot>
              ) : null}
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 items-start gap-4 mt-6">
          <div className="col-span-1 md:col-span-2">
            <BaseCard customStyle="shadow-lg">
              <h3 className="font-semibold text-2xl">Payment Method</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5 mt-4">
                <div className="flex items-center p-2 border border-gray-200 rounded-xl">
                  <input
                    id="seabank"
                    type="radio"
                    name="bordered-radio"
                    onChange={(event) => setBank(event.target.value)}
                    value="seabank"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                  />
                  <label
                    htmlFor="seabank"
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    <Image
                      src="https://everhealth-asset.irfancen.com/bank/seabank.png"
                      alt="logo seabank"
                      width={120}
                      height={80}
                      loading="lazy"
                    />
                  </label>
                </div>
                <div className="flex items-center p-2 border border-gray-200 rounded-xl">
                  <input
                    id="bri"
                    type="radio"
                    name="bordered-radio"
                    onChange={(event) => setBank(event.target.value)}
                    value="bri"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                  />
                  <label
                    htmlFor="bri"
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    <Image
                      src="https://everhealth-asset.irfancen.com/bank/bri.png"
                      alt="logo bri"
                      width={100}
                      height={50}
                    />
                  </label>
                </div>
                <div className="flex items-center p-2 border border-gray-200 rounded-xl">
                  <input
                    id="bca"
                    type="radio"
                    name="bordered-radio"
                    onChange={(event) => setBank(event.target.value)}
                    value="bca"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                  />
                  <label
                    htmlFor="bca"
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    <Image
                      src="https://everhealth-asset.irfancen.com/bank/bca.webp"
                      alt="logo bca"
                      width={100}
                      height={50}
                    />
                  </label>
                </div>
                <div className="flex items-center p-2 border border-gray-200 rounded-xl">
                  <input
                    id="bni"
                    type="radio"
                    name="bordered-radio"
                    onChange={(event) => setBank(event.target.value)}
                    value="bni"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                  />
                  <label
                    htmlFor="bni"
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    <Image
                      src="https://everhealth-asset.irfancen.com/bank/bni.png"
                      alt="logo bni"
                      width={100}
                      height={50}
                    />
                  </label>
                </div>
                <div className="flex items-center p-2 border border-gray-200 rounded-xl">
                  <input
                    id="btpn"
                    type="radio"
                    name="bordered-radio"
                    onChange={(event) => setBank(event.target.value)}
                    value="btpn"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                  />
                  <label
                    htmlFor="btpn"
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    <Image
                      src="https://everhealth-asset.irfancen.com/bank/btpn.png"
                      alt="logo btpn"
                      width={120}
                      height={80}
                      loading="lazy"
                    />
                  </label>
                </div>
                <div className="flex items-center p-2 border border-gray-200 rounded-xl">
                  <input
                    id="mandiri"
                    type="radio"
                    name="bordered-radio"
                    onChange={(event) => setBank(event.target.value)}
                    value="mandiri"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                  />
                  <label
                    htmlFor="mandiri"
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    <Image
                      src="https://everhealth-asset.irfancen.com/bank/mandiri.png"
                      alt="logo mandiri"
                      width={120}
                      height={80}
                      loading="lazy"
                    />
                  </label>
                </div>
                <div className="flex items-center p-2 border border-gray-200 rounded-xl">
                  <input
                    id="mega"
                    type="radio"
                    name="bordered-radio"
                    onChange={(event) => setBank(event.target.value)}
                    value="mega"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                  />
                  <label
                    htmlFor="mega"
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    <Image
                      src="https://everhealth-asset.irfancen.com/bank/mega.svg"
                      alt="logo mega"
                      width={120}
                      height={80}
                      loading="lazy"
                    />
                  </label>
                </div>
                <div className="flex items-center p-2 border border-gray-200 rounded-xl">
                  <input
                    id="bsi"
                    type="radio"
                    name="bordered-radio"
                    onChange={(event) => setBank(event.target.value)}
                    value="bsi"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                  />
                  <label
                    htmlFor="bsi"
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    <Image
                      src="https://everhealth-asset.irfancen.com/bank/bsi.png"
                      alt="logo bsi"
                      width={120}
                      height={80}
                      loading="lazy"
                    />
                  </label>
                </div>
              </div>
            </BaseCard>
          </div>

          <BaseCard customStyle="shadow-lg">
            <h3 className="font-semibold text-2xl mb-4">Order Summary</h3>
            {order.data &&
              (order.data.error ? (
                <div>Sorry, {order.data.error}</div>
              ) : (
                order.data.data &&
                order.data.data.order_item.map((val, i) => {
                  return (
                    <div
                      key={`orderItem-${i}`}
                      className="flex justify-between gap-8 mb-2"
                    >
                      <div className="font-medium text-sm">
                        {val.name}{" "}
                        <span className="font-thin"> x{val.qty}</span>
                      </div>
                      <div>{formatToRupiah(Number(val.sub_total))}</div>
                    </div>
                  );
                })
              ))}

            {order.data && !order.data.error && (
              <>
                <hr className="h-px mb-2 bg-gray-200 border-0"></hr>
                <div className="flex justify-between">
                  <div className="text-[#999999] font-thin">Subtotal</div>
                  <div>
                    {formatToRupiah(Number(order.data.data?.total_amount))}
                  </div>
                </div>
              </>
            )}

            {order.data && !order.data.error ? (
              <>
                <div className="flex justify-between mt-2">
                  <div className="text-[#999999] font-thin">
                    Shipping cost ({shipping ? shipping.name : "-"})
                  </div>
                  <div>
                    {shipping ? formatToRupiah(Number(shipping.cost)) : "-"}
                  </div>
                </div>
                <hr className="h-px mt-3 mb-2 bg-gray-200 border-0 border-dashed"></hr>
                <div className="flex justify-between mt-2">
                  <div className="font-semibold">
                    Total Cost{" "}
                    <span className="text-[#999999] font-thin">
                      (
                      {order.data &&
                        order.data.data &&
                        order.data.data.total_item}{" "}
                      items)
                    </span>
                  </div>
                  <div className="font-bold">
                    {formatToRupiah(Number(totalOrder))}
                  </div>
                </div>
              </>
            ) : null}

            <div className="flex justify-end mt-6 ">
              <Button
                variants="primary"
                onClick={handleOrder}
                disabled={order.data && "error" in order.data ? true : false}
              >
                Place Order
              </Button>
            </div>
          </BaseCard>
        </section>
      </div>
    </>
  );
};

export default Checkout;
