import React, { useEffect, useState } from "react";
import Head from "next/head";
import SortOrder from "@/components/Sort/SortOrder";
import { InputField } from "@/components/Input/InputField";
import { orderBy } from "@/lib/orderBy";
import { Order, PostResponse } from "@/types";
import { apiBaseUrl } from "@/config";
import OrderHistoryCard from "@/components/Card/OrderHistoryCard";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination/Pagination";
import { useFetch } from "@/hooks/useFetch";
import { useFilter } from "@/hooks/useFilter";
import { arrStatus, objStatus } from "@/lib/filterBy";
import Spinner from "@/components/Loading/Spinner";
import { getToken } from "@/utils/token";
import { toast } from "sonner";
import BaseCard from "@/components/Card/BaseCard";
import Image from "next/image";

const OrderHistory = () => {
  const searchParam = "name";
  const defaultSortTitle = "Order Date";
  const filterParam = "status";
  const sortBy = ["Order Date", "Price"];
  const router = useRouter();
  const token = getToken();
  const { data, fetchData: putOrders, error } = useFetch<PostResponse>();

  const {
    swrResponse: orders,
    searchInput,
    handleSearchInput,
    sortTitle,
    setSortTitle,
    orderTitle,
    setOrderTitle,
    filterTitle,
    setFilterTitle,
    setPage,
  } = useFilter<Order>(
    "order",
    searchParam,
    defaultSortTitle,
    6,
    filterParam,
    objStatus,
    "Desc"
  );

  const handleActionStatus = async (id: number, newStatus: number) => {
    const url = `${apiBaseUrl}/order/${id}/status-user`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    };
    await putOrders(url, options);
    orders.mutate();
  };

  useEffect(() => {
    const res = data as PostResponse;
    if (res.message === "update success") {
      toast.success("Successfully update the order status.");
      return;
    }
    if (error !== null) {
      toast.error("Failed to update the order status.");
    }
  }, [data, error]);

  return (
    <>
      <Head>
        <title>Order History | User</title>
      </Head>
      <div className="py-24 w-11/12 lg:w-4/5 m-auto max-w-screen-xl">
        <h1 className="mt-16 text-primary-text font-semibold text-3xl">
          Order History
        </h1>
        <div className="flex flex-col sm:flex-row w-full justify-between sm:items-center mt-10">
          <div className="flex items-center text-sm gap-4 ">
            <SortOrder
              sortBy={sortBy}
              orderBy={orderBy}
              sortTitle={sortTitle}
              setSortTitle={setSortTitle}
              orderTitle={orderTitle}
              setOrderTitle={setOrderTitle}
              filterBy={arrStatus}
              filterTitle={filterTitle}
              setFilterTitle={setFilterTitle}
            />
          </div>
          <div>
            <InputField
              type="text"
              variants="small"
              name="name"
              placeholder="Search by item name"
              value={searchInput}
              onChange={handleSearchInput}
            />
          </div>
        </div>
        {orders.error && (
          <div>Error when fetching the data. Please refresh the page</div>
        )}
        {orders.isLoading && <Spinner />}
        {orders.data &&
          (orders.data.data !== null ? (
            <>
              <div className="grid lg:grid-cols-2 gap-8 mt-4">
                {orders.data.data.map((order, idx) => (
                  <div key={idx}>
                    <OrderHistoryCard
                      order={order}
                      handleActionStatus={handleActionStatus}
                      handleDetails={() =>
                        router.push(
                          `/user/order-history/${parseInt(order.id) - 70000}`
                        )
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-28">
                <Pagination
                  totalPage={orders.data.total_page}
                  activePage={orders.data.current_page}
                  setPage={setPage}
                />
              </div>
            </>
          ) : (
            <div className="mt-8">
              <BaseCard>
                <div className="flex flex-col font-semibold text-xl justify-center items-center">
                  <Image
                    src="https://everhealth-asset.irfancen.com/assets/map.png"
                    alt="no location"
                    width={350}
                    height={350}
                  />
                  There is no order history.
                </div>
              </BaseCard>
            </div>
          ))}
      </div>
    </>
  );
};

export default OrderHistory;
