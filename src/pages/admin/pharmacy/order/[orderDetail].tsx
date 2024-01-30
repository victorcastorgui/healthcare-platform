import BackButton from "@/components/Button/BackButton";
import Button from "@/components/Button/Button";
import BaseCard from "@/components/Card/BaseCard";
import AdminHeader from "@/components/Header/AdminHeader";
import OrderStatus from "@/components/Label/OrderStatus";
import PharmacyLayout from "@/components/Layout/PharmacyLayout";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import ImageModal from "@/components/Modal/ImageModal";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { useFetch } from "@/hooks/useFetch";
import { OrderDetail } from "@/types";
import { capitalizeFirstChar } from "@/utils/formatter/capitalizeFirstChar";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { getToken } from "@/utils/token";
import moment from "moment";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PatchResponse = {
  message: string;
  error: string;
};

const OrderDetail = () => {
  const router = useRouter();
  const { query } = useRouter();
  const url = `${apiBaseUrl}/order/${query.orderDetail}`;
  const {
    data: orderHistoryDetail,
    error,
    mutate,
  } = useCustomSWR<OrderDetail>(query.orderDetail ? url : null);

  const [isOpenedImage, setIsOpenedImage] = useState<boolean>(false);
  const { data, fetchData: patchData } = useFetch<PatchResponse>();
  const token = getToken();
  const orderId = query.orderDetail;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancel, setIsCancel] = useState(false);

  useEffect(() => {
    if (data !== null) {
      mutate();
    }
  }, [data]);

  useEffect(() => {
    if (data === "") {
      return;
    }
    if (data !== null) {
      const response = data as PatchResponse;
      if (response.error !== undefined) {
        toast.error(response.error);
      }
      if (response.message === "update success") {
        toast.success("Update Status Successfully!");
      }
    }
  }, [data]);

  const handleOnProcess = async (orderId: number, newStatus: number) => {
    const URL = `${apiBaseUrl}/order/${orderId}/status-admin`;
    const options = {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        status: newStatus,
      }),
    };
    await patchData(URL, options);
  };

  const handleOnSend = async (orderId: number, newStatus: number) => {
    const URL = `${apiBaseUrl}/order/${orderId}/status-admin`;
    const options = {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        status: newStatus,
      }),
    };
    await patchData(URL, options);
  };

  const handleOnCancel = async (orderId: number, newStatus: number) => {
    const URL = `${apiBaseUrl}/order/${orderId}/status-admin`;
    const options = {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        status: newStatus,
      }),
    };
    await patchData(URL, options);
  };

  return (
    <>
      {orderHistoryDetail?.data.order_status.toString() ===
        "waiting for payment confirmation" && (
        <ConfirmationModal
          isOpen={isConfirmOpen}
          setIsOpen={setIsConfirmOpen}
          message={"Are you sure you want to process the order?"}
          newStatus={3}
          orderId={parseInt(orderId as string)}
          handleOnConfirm={handleOnProcess}
        />
      )}
      {orderHistoryDetail?.data.order_status.toString() === "processed" && (
        <ConfirmationModal
          isOpen={isConfirmOpen}
          setIsOpen={setIsConfirmOpen}
          message={"Are you sure you want to send the order"}
          newStatus={4}
          orderId={parseInt(orderId as string)}
          handleOnConfirm={handleOnSend}
        />
      )}
      <ConfirmationModal
        isOpen={isCancel}
        setIsOpen={setIsCancel}
        message={"Are you sure you want to cancel the order"}
        newStatus={6}
        orderId={parseInt(orderId as string)}
        handleOnConfirm={handleOnCancel}
      />
      <PharmacyLayout>
        <Head>
          <title>Order Detail</title>
        </Head>
        <AdminHeader>Order Detail</AdminHeader>
        <div className="mt-4 flex justify-between items-center max-sm:flex-col gap-4">
          <BackButton route="/admin/pharmacy/order" />
          {orderHistoryDetail?.data !== null && (
            <>
              {orderHistoryDetail?.data.order_status.toString() ===
                "waiting for payment confirmation" && (
                <>
                  <BaseCard customStyle="!flex-row gap-4">
                    <div className="w-full">
                      <Button
                        variants="primary"
                        onClick={() => setIsConfirmOpen(true)}
                      >
                        Process Order
                      </Button>
                    </div>
                    <div className="w-full">
                      <Button
                        variants="danger"
                        onClick={() => setIsCancel(true)}
                      >
                        Cancel Order
                      </Button>
                    </div>
                  </BaseCard>
                </>
              )}
              {orderHistoryDetail?.data.order_status.toString() ===
                "processed" && (
                <BaseCard customStyle="!flex-row gap-4">
                  <div className="w-full">
                    <Button
                      variants="primary"
                      onClick={() => setIsConfirmOpen(true)}
                    >
                      Send Order
                    </Button>
                  </div>
                  <div className="w-full">
                    <Button variants="danger" onClick={() => setIsCancel(true)}>
                      Cancel Order
                    </Button>
                  </div>
                </BaseCard>
              )}
            </>
          )}
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
                              <h3 className="font-semibold">
                                {orderItem.name}
                              </h3>
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
          </BaseCard>
        </div>
      </PharmacyLayout>
    </>
  );
};

export default OrderDetail;
