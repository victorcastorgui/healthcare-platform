import Button from "@/components/Button/Button";
import AdminHeader from "@/components/Header/AdminHeader";
import OrderStatus from "@/components/Label/OrderStatus";
import PharmacyLayout from "@/components/Layout/PharmacyLayout";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { useFilter } from "@/hooks/useFilter";
import { adminTableNumbering } from "@/lib/adminTableNumbering";
import { arrStatus, objStatus } from "@/lib/filterBy";
import { OrderList } from "@/types";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";

function PharOrder() {
  const { push } = useRouter();
  const tableHeads = [
    "",
    "User",
    "Items",
    "Order Date",
    "Shipping Method",
    "Total Price",
    "Order Status",
    "",
  ];

  let url = `order`;
  const {
    swrResponse: orderList,
    handleSearchInput,
    setOrderTitle,
    searchInput,
    sortTitle,
    setSortTitle,
    orderTitle,
    setFilterTitle,
    filterTitle,
    setPage,
  } = useFilter<OrderList>(url, "name", "Order Date", 5, "status", objStatus);

  return (
    <PharmacyLayout>
      <Head>
        <title>Order List</title>
      </Head>
      <AdminHeader>Order List</AdminHeader>
      <Table
        tableHeads={tableHeads}
        setSortTitle={setSortTitle}
        searchInput={searchInput}
        handleSearchInput={handleSearchInput}
        sortBy={["Order Date", "Price"]}
        sortTitle={sortTitle}
        orderTitle={orderTitle}
        setOrderTitle={setOrderTitle}
        setFilterTitle={setFilterTitle}
        filterTitle={filterTitle}
        filterBy={arrStatus}
        searchName={"Search by User Name..."}
      >
        {orderList.data?.data === null ? (
          <div className="h-20 flex items-center pl-4">Data Not Found</div>
        ) : (
          <>
            {orderList.data?.data.map((val, index) => (
              <tr
                key={adminTableNumbering(orderList.data!.current_page, index)}
              >
                <td>
                  {adminTableNumbering(orderList.data!.current_page, index)}
                </td>
                <td>{val.name}</td>
                <td>{val.item_order}</td>
                <td>{moment(val.order_date).format("DD-MM-YYYY hh:mm A")}</td>
                <td>{val.shipping_name}</td>
                <td>{formatToRupiah(parseInt(val.total_price))}</td>
                <td className="min-w-48">
                  <OrderStatus status={val.order_status} />
                </td>
                <td className="flex gap-4">
                  <div>
                    <Button
                      variants={"secondary"}
                      onClick={() =>
                        push(`/admin/pharmacy/order/${val.id - 70000}`)
                      }
                    >
                      Detail
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </>
        )}
      </Table>
      <div className="flex w-full justify-center my-8">
        {orderList.data && (
          <Pagination
            totalPage={orderList.data.total_page}
            activePage={orderList.data.current_page}
            setPage={setPage}
          />
        )}
      </div>
    </PharmacyLayout>
  );
}

export default PharOrder;
