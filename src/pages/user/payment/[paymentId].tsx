import React, { useEffect, useState } from "react";
import Image from "next/image";
import BaseCard from "@/components/Card/BaseCard";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { ResponseError, TOrderDetail } from "@/types";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { MapPin, Store } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { getToken } from "@/utils/token";
import { useRouter } from "next/router";
import CopyTextIcon from "@/components/CopyTextIcon/CopyTextIcon";
import Head from "next/head";
import Button from "@/components/Button/Button";
import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";

const Payment = () => {
  const [image, setImage] = useState<string | null>(null);
  const [paymentProof, setPaymentProof] = useState<string | File>();

  const token = getToken();
  const router = useRouter();

  const order = useCustomSWR<TOrderDetail & ResponseError>(
    router.query.paymentId
      ? `${apiBaseUrl}/order/${Number(router.query.paymentId)}`
      : null
  );
  const cart = useCustomSWR(
    router.query.paymentId ? `${apiBaseUrl}/cart` : null
  );
  const { data: dataUpdateOrder, fetchData: updateOrder } = useFetch();

  useEffect(() => {
    if (dataUpdateOrder) {
      toast.success("Upload success! Please wait confirmation from admin:)");
      router.push("/user/order-history");
    }
  }, [dataUpdateOrder]);

  useEffect(() => {
    if (order.data && order.data.error) {
      toast.error("There are no order!");
      router.push("/user/order-history");
    }

    if (
      order.data &&
      order.data.data &&
      order.data.data.order_status !== "waiting for payment"
    ) {
      toast.error("Page not found:)");
      router.push("/user/order-history");
    }
  }, [order]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].size > 500000) {
      toast.error("Apologies, the maximum allowable image size is 500 kB.");
    } else if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (paymentProof) {
      const data = new FormData();
      data.append("image", paymentProof);

      updateOrder(
        `${apiBaseUrl}/order/${router.query.paymentId}/upload-proof`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );
      return;
    }

    toast.error("You must upload payment proof:)");
  };

  return (
    <>
      <Head>
        <title>Payment</title>
      </Head>
      <section className="w-11/12 lg:w-4/5 max-w-screen-sm md:max-w-screen-xl mx-auto pt-24 pb-12">
        {order.data &&
          order.data.data &&
          order.data.data.order_status === "waiting for payment" && (
            <>
              <h2 className="text-3xl font-bold mt-4">Payment</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 justify-center items-start gap-8 mt-6">
                <div className="flex flex-col col-span-1 md:col-span-2 gap-4">
                  <BaseCard>
                    <div className="flex items-center gap-1 font-semibold text-xl text-primary">
                      <MapPin size={20} /> Delivery Address
                    </div>
                    {order.data && order.data.data && (
                      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mt-4 ml-2">
                        <div className="font-semibold">
                          {order.data.data.name} ({order.data.data.phone})
                        </div>
                        <div>
                          {order.data.data.street} {order.data.data.detail}{" "}
                          {order.data.data.province}, {order.data.data.city}, ID{" "}
                          {order.data.data.postal_code}
                        </div>
                      </div>
                    )}
                  </BaseCard>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="col-span-1 sm:col-span-2">
                      <BaseCard>
                        <h3 className="font-semibold text-2xl mb-3">Payment</h3>
                        <div className="flex justify-between items-center mt-3">
                          <div className="text-lg">
                            Account Number:{" "}
                            <span className="font-semibold select-all">
                              1021868341
                            </span>
                          </div>
                          <CopyTextIcon textToCopy="1021868341" />
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="text-lg">
                            Total:{" "}
                            <span className="font-semibold select-all">
                              {formatToRupiah(
                                Number(order.data?.data?.total_price)
                              )}
                            </span>
                          </div>
                          <CopyTextIcon
                            textToCopy={
                              order.data && order.data.data
                                ? order.data.data.total_price
                                : "-"
                            }
                          />
                        </div>
                      </BaseCard>
                    </div>

                    <BaseCard>
                      <h3 className="font-semibold text-2xl md:text-xl lg:text-2xl mb-4">
                        Expired At
                      </h3>
                      {order.data &&
                        (order.data.data.order_status ===
                        "waiting for payment" ? (
                          <CountdownTimer
                            expirationDate={
                              new Date(order.data.data.expired_at)
                            }
                          />
                        ) : (
                          <div></div>
                        ))}
                    </BaseCard>
                  </div>

                  {order.data &&
                    order.data.data.order_status === "waiting for payment" && (
                      <BaseCard>
                        <h3 className="font-semibold text-2xl mb-4">
                          Upload Payment
                        </h3>
                        <div className="flex items-center justify-center w-full gap-5">
                          {image && (
                            <Image
                              src={image}
                              alt="payment proof"
                              width={200}
                              height={180}
                              className="w-[200px] h-[180px]"
                            />
                          )}
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="dropzone-file"
                              className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 disabled:bg-slate-700"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 20 16"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                  />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 font-semibold dark:text-gray-400">
                                  Click to upload
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Only PNG (Max. 500 Kb)
                                </p>
                              </div>
                              <input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                accept="image/png"
                                onChange={(e) => handleImage(e)}
                                disabled={
                                  order.data &&
                                  order.data.data &&
                                  order.data.data.order_status ===
                                    "waiting for payment"
                                    ? false
                                    : true
                                }
                              />
                            </label>
                          </div>
                        </div>

                        <div className="max-w-44 mt-6">
                          <Button
                            variants="secondary"
                            onClick={handleSubmit}
                            disabled={
                              order.data &&
                              order.data.data &&
                              order.data.data.order_status ===
                                "waiting for payment"
                                ? false
                                : true
                            }
                          >
                            Upload
                          </Button>
                        </div>
                      </BaseCard>
                    )}
                </div>

                <BaseCard>
                  <div className="flex gap-2 items-center mb-4">
                    <Store size={24} />
                    <h3 className="font-semibold text-2xl">Order Summary</h3>
                  </div>
                  {order.data &&
                    order.data.data &&
                    order.data.data.order_items.map((val, i) => {
                      return (
                        <div
                          key={`orderItem-${i}`}
                          className="flex justify-between gap-8 mb-2"
                        >
                          <div className="font-medium">
                            {val.name}{" "}
                            <span className="font-thin"> x{val.quantity}</span>
                          </div>
                          <div>{formatToRupiah(Number(val.sub_total))}</div>
                        </div>
                      );
                    })}
                  <hr className="h-px mb-2 bg-gray-200 border-0"></hr>

                  <div className="flex justify-between gap-4">
                    <div className="text-[#999999] font-thin">Subtotal</div>
                    <div>
                      {formatToRupiah(
                        Number(
                          order.data &&
                            order.data.data &&
                            order.data.data.product_price
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="text-[#999999] font-thin">
                      Shipping cost ({order.data?.data?.shipping_name})
                    </div>
                    <div>
                      {formatToRupiah(Number(order.data?.data?.shipping_price))}
                    </div>
                  </div>
                  <hr className="h-px mt-3 mb-2 bg-gray-200 border-0 border-dashed"></hr>
                  <div className="flex justify-between mt-2">
                    <div className="font-semibold">
                      Total Cost{" "}
                      <span className="text-[#999999] font-thin">
                        ({order.data?.data?.order_items.length} items)
                      </span>
                    </div>
                    <div className="font-bold">
                      {formatToRupiah(Number(order.data?.data?.total_price))}
                    </div>
                  </div>
                </BaseCard>
              </div>
            </>
          )}
      </section>
    </>
  );
};

export default Payment;
