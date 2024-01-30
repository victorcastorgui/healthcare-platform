import React, { useState } from "react";
import Button from "@/components/Button/Button";
import BaseCard from "@/components/Card/BaseCard";
import Image from "next/image";
import { OrderData } from "@/types";
import OrderStatus from "@/components/Label/OrderStatus";
import moment from "moment";
import { formatToTitleCase } from "@/utils/formatter/formatToTitleCase";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { useRouter } from "next/router";

type TOrderHistoryCard = {
  order: OrderData;
  handleDetails: () => void;
  handleActionStatus: (id: number, newStatus: number) => void;
};

const OrderHistoryCard = ({
  order,
  handleActionStatus,
  handleDetails,
}: TOrderHistoryCard) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<number>(0);
  const [mess, setMess] = useState<string>("");

  const router = useRouter();

  return (
    <>
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          handleOnConfirm={handleActionStatus}
          orderId={parseInt(orderId) - 70000}
          newStatus={orderStatus}
          message={mess}
        />
      )}
      <BaseCard>
        <div className="flex w-full items-center gap-6">
          <div className="flex flex-col gap-1 justify-center items-center">
            <div className="relative w-[150px] h-[150px] mx-auto">
              <Image
                src={order.order_items[0].image}
                fill
                sizes="100%"
                className="object-cover"
                alt="Product Image"
                priority
              />
            </div>
            {order.item_order > 1 && (
              <p className="text-gray-400 text-center">
                +{order.item_order - 1} other items
              </p>
            )}
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-end w-full">
              <OrderStatus status={order.order_status} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col xl:flex-row gap-1">
                <p className="font-semibold">Order Date:</p>
                <p>{moment(order.order_date).format("DD-MM-YYYY hh:mm A")}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col xl:flex-row justify-between items-start">
                <div className="flex flex-col">
                  <p className="font-semibold text-lg">
                    {formatToTitleCase(order.order_items[0].name)}
                  </p>
                  <p
                    className={`text-gray-400 ${
                      order.item_order <= 1 ? "text-white" : ""
                    }`}
                  >
                    +{order.item_order - 1} other items
                  </p>
                </div>
                <p>
                  {formatToRupiah(parseInt(order.order_items[0].sub_total))}
                </p>
              </div>
              <div className="flex flex-col xl:flex-row justify-between">
                <p className="font-semibold">
                  {`${formatToTitleCase(order.shipping_name)}`}{" "}
                  <span className="text-sm">({order.shipping_eta})</span>
                </p>
                <p>{formatToRupiah(parseInt(order.shipping_price))}</p>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row justify-between mt-2">
              <p>Total Price</p>
              <p className="text-2xl font-semibold">
                {formatToRupiah(parseInt(order.total_price))}
              </p>
            </div>
            <div className="flex justify-between">
              <Button
                className="text-primary text-sm font-medium"
                onClick={handleDetails}
              >
                See details
              </Button>
              <div>
                {order.order_status.toLowerCase() === "sent" ? (
                  <>
                    <Button
                      variants="secondary"
                      onClick={() => {
                        setIsModalOpen(true);
                        setOrderId(order.id);
                        setOrderStatus(5);
                        setMess(
                          "Are you sure want to confirm the order? Make sure you have received the product."
                        );
                      }}
                    >
                      Confirm Order
                    </Button>
                  </>
                ) : order.order_status.toLowerCase() ===
                  "waiting for payment" ? (
                  <div className="flex gap-6">
                    <div className="w-20">
                      <Button
                        variants="secondary"
                        onClick={() => {
                          router.push(
                            `/user/payment/${Number(order.id) - 70000}`
                          );
                        }}
                      >
                        Pay
                      </Button>
                    </div>
                    <div className="w-20">
                      <Button
                        variants="danger"
                        onClick={() => {
                          setIsModalOpen(true);
                          setOrderId(order.id);
                          setOrderStatus(6);
                          setMess("Are you sure want to cancel the order?");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button className="btn btn-ghost opacity-0 cursor-default">
                    Empty
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </>
  );
};

export default OrderHistoryCard;
