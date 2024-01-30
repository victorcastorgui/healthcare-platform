import BackButton from "@/components/Button/BackButton";
import BaseCard from "@/components/Card/BaseCard";
import AdminHeader from "@/components/Header/AdminHeader";
import OrderStatus from "@/components/Label/OrderStatus";
import AdminLayout from "@/components/Layout/AdminLayout";
import ImageModal from "@/components/Modal/ImageModal";
import { apiBaseUrl } from "@/config";
import { OrderDetail } from "@/types";
import { capitalizeFirstChar } from "@/utils/formatter/capitalizeFirstChar";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { ArrowLeft } from "lucide-react";
import moment from "moment";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Email from "../../../../../public/images/email.svg";
import WhatsApp from "../../../../../public/images/whatapp.svg";

const OrderDetail = ({
  orderHistoryDetail,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [isOpenedImage, setIsOpenedImage] = useState<boolean>(false);

  return (
    <AdminLayout>
      <Head>
        <title>Order Detail</title>
      </Head>
      <AdminHeader>Order Detail</AdminHeader>
      <div className="flex justify-between gap-4 items-center max-[406px]:flex-col">
        <BackButton route="/admin/super/order" />
        <BaseCard customStyle="!w-fit !flex-row">
          <h3>Contact Pharmacy</h3>
          <div className="flex gap-4 justify-between px-4 items-center">
            {orderHistoryDetail?.data.pharmacy_contact && (
              <a
                href={`https://wa.me/${orderHistoryDetail.data.pharmacy_contact}`}
                className="h-8 w-8"
              >
                <Image
                  src={WhatsApp}
                  height={40}
                  width={40}
                  alt="Whatsapp logo"
                />
              </a>
            )}
            {orderHistoryDetail?.data.pharmacy_email && (
              <a
                href={`mailto:${orderHistoryDetail.data.pharmacy_email}`}
                className="h-12 w-12"
              >
                <Image src={Email} height={50} width={50} alt="Email logo" />
              </a>
            )}
          </div>
        </BaseCard>
      </div>
      {isOpenedImage && orderHistoryDetail && orderHistoryDetail.data && (
        <ImageModal
          isOpen={isOpenedImage}
          onClose={() => setIsOpenedImage(false)}
          imageSrc={
            orderHistoryDetail.data.payment_proof !== ""
              ? orderHistoryDetail.data.payment_proof
              : "https://everhealth-asset.irfancen.com/assets/empty-payment.jpg"
          }
        />
      )}
      <div className="mt-10">
        <BaseCard customStyle="mb-8">
          {error && (
            <div>Error when fetching data, please refresh the page</div>
          )}
          {orderHistoryDetail && orderHistoryDetail.data && (
            <div className="flex flex-col px-8 gap-6">
              <div className="flex flex-col lg:flex-row gap-6 justify-between border-b pb-6">
                <div className="flex flex-col gap-4">
                  <p>
                    <span className="font-semibold">Order ID: </span>
                    {orderHistoryDetail.data.id}
                  </p>
                  <p>
                    <span className="font-semibold">Order Date: </span>
                    {moment(orderHistoryDetail.data.ordered_at).format(
                      "DD-MM-YYYY hh:mm A"
                    )}
                  </p>
                  <div className="flex gap-2">
                    <p className="font-semibold">Order Status: </p>
                    <OrderStatus
                      status={orderHistoryDetail.data.order_status.toString()}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-semibold">Destination Address:</p>
                  <p className="font-semibold">{`${orderHistoryDetail.data.name} (${orderHistoryDetail.data.phone})`}</p>
                  <p>{`${orderHistoryDetail.data.street}, ${orderHistoryDetail.data.city}, ${orderHistoryDetail.data.province} ${orderHistoryDetail.data.postal_code}`}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-b pb-6 ">
                <h2 className="font-semibold text-lg">Order items</h2>
                <div className="flex flex-col">
                  <div className="grid lg:grid-cols-2 gap-6 px-6">
                    {orderHistoryDetail.data.order_items.map(
                      (orderItem, idx) => (
                        <div
                          key={idx}
                          className="border border-solid rounded-xl flex gap-5 py-2 px-4"
                        >
                          <div className="relative w-[100px]">
                            <Image
                              src={orderItem.image}
                              fill
                              sizes="100%"
                              className="object-contain"
                              alt={orderItem.name}
                            />
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <h3 className="font-semibold">{orderItem.name}</h3>
                            <p>&#215;{orderItem.quantity}</p>
                            <p>
                              {formatToRupiah(parseInt(orderItem.sub_total))}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">
                  Payment & Cost Summary
                </h2>
                <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-16">
                  <table className="w-full border-separate border-spacing-y-2">
                    <tbody>
                      <tr>
                        <td>Product subtotal</td>
                        <td className="text-right">
                          {formatToRupiah(
                            parseInt(orderHistoryDetail.data.product_price)
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex flex-col">
                            <p>Shipping cost</p>
                            <p className="text-sm text-gray-500">
                              {capitalizeFirstChar(
                                orderHistoryDetail.data.shipping_name
                              )}
                            </p>
                          </div>
                        </td>
                        <td className="text-right">
                          {formatToRupiah(
                            parseInt(orderHistoryDetail.data.shipping_price)
                          )}
                        </td>
                      </tr>
                      <tr className="text-lg font-semibold">
                        <td>Total Cost</td>
                        <td className="text-right">
                          {formatToRupiah(
                            parseInt(orderHistoryDetail.data.total_price)
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex flex-col gap-2 w-full">
                    <p>Payment proof</p>
                    <Image
                      src={
                        orderHistoryDetail.data.payment_proof !== ""
                          ? orderHistoryDetail.data.payment_proof
                          : "https://everhealth-asset.irfancen.com/assets/empty-payment.jpg"
                      }
                      width={150}
                      height={150}
                      alt={`Payment proof for order ${orderHistoryDetail.data.id}`}
                      onClick={() => setIsOpenedImage(true)}
                      className="cursor-pointer"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            className="flex gap-2 mt-10 cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft color="#B2B8C1" />
            <p className="text-gray-400">Back to order history page</p>
          </div>
        </BaseCard>
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;

type ServerOrderHisDetail = {
  orderHistoryDetail?: OrderDetail;
  error?: string;
};

export const getServerSideProps: GetServerSideProps<
  ServerOrderHisDetail
> = async (context) => {
  const { orderDetail } = context.query;
  const token = context.req.cookies.token;

  try {
    const res = await fetch(`${apiBaseUrl}/order/${orderDetail}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const orderHistoryDetail: OrderDetail = await res.json();
    return {
      props: {
        orderHistoryDetail: orderHistoryDetail,
      },
    };
  } catch (err) {
    return {
      props: {
        error: err instanceof Error ? err.message : undefined,
      },
    };
  }
};
