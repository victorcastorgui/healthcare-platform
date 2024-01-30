import Button from "@/components/Button/Button";
import AdminHeader from "@/components/Header/AdminHeader";
import OrderStatus from "@/components/Label/OrderStatus";
import PharmacyLayout from "@/components/Layout/PharmacyLayout";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { apiBaseUrl } from "@/config";
import { useFetch } from "@/hooks/useFetch";
import { useFilter } from "@/hooks/useFilter";
import { adminTableNumbering } from "@/lib/adminTableNumbering";
import { StockMutationHistory } from "@/types";
import { getToken } from "@/utils/token";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Response = {
  message: string;
  error: string[];
};

function MutationHistory() {
  const token = getToken();
  const [orderId, setOrderId] = useState<number>();
  const { data, fetchData: changeStatus } = useFetch<Response>();
  const [isOpen, setIsOpen] = useState(false);
  const { push } = useRouter();
  const tableHeads = [
    "",
    "Product Name",
    "Qty",
    "From",
    "To",
    "Mutated At",
    "Status",
    "",
  ];
  const sortBy = ["Quantity", "Mutated"];
  const defaultSortTitle = sortBy[0];
  const filterParam = "status";
  const searchBy = "pharmacy_name";
  const {
    swrResponse: mutationList,
    handleSearchInput,
    searchInput,
    orderTitle,
    setOrderTitle,
    setFilterTitle,
    filterTitle,
    setPage,
    setSortTitle,
    sortTitle,
  } = useFilter<StockMutationHistory>(
    "stock-mutations",
    searchBy,
    defaultSortTitle,
    5,
    filterParam,
    { Accept: 1, Decline: 2, Pending: 3 }
  );

  useEffect(() => {
    const response = data as Response;
    if (response.message === "created success") {
      toast.success("Request has been accepted!");
      mutationList.mutate();
    }
  }, [data]);

  const handleOnConfirm = (orderId: number, newStatus: number) => {
    let status;
    if (newStatus === 6) {
      status = true;
    }
    const URL = `${apiBaseUrl}/stock-mutations/${orderId}/change-status`;
    const options = {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        is_accept: status,
      }),
    };
    changeStatus(URL, options);
  };
  return (
    <>
      <ConfirmationModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        message="Are you sure you want to accept the request?"
        handleOnConfirm={handleOnConfirm}
        orderId={orderId as number}
        newStatus={6}
      />
      <PharmacyLayout>
        <Head>
          <title>Stock Mutations</title>
        </Head>
        <AdminHeader>Stock Mutations</AdminHeader>
        <Table
          tableHeads={tableHeads}
          searchInput={searchInput}
          handleSearchInput={handleSearchInput}
          sortBy={sortBy}
          sortTitle={sortTitle}
          setSortTitle={setSortTitle}
          orderTitle={orderTitle}
          setOrderTitle={setOrderTitle}
          setFilterTitle={setFilterTitle}
          filterTitle={filterTitle}
          filterBy={["Accept", "Pending", "Decline"]}
          searchName="Search by Pharmacy Name..."
          componentBesideSearch={
            <Button
              variants="primary"
              onClick={() => push("/admin/pharmacy/stock-mutation/create")}
            >
              Create Stock Mutation
            </Button>
          }
        >
          {mutationList &&
            mutationList.data?.data.map((val, index) => (
              <tr
                key={adminTableNumbering(
                  mutationList.data!.current_page,
                  index
                )}
              >
                <td>
                  {adminTableNumbering(mutationList.data!.current_page, index)}
                </td>
                <td>{val.form_pharmacy_product.name}</td>
                <td>{val.quantity}</td>
                <td>{val.form_pharmacy_product.pharmacy.name}</td>
                <td>{val.to_pharmacy_product.pharmacy.name}</td>
                <td>{moment(val.mutated_at).format("DD-MM-YYYY hh:mm A")}</td>
                <td className="min-w-48">
                  <OrderStatus status={val.status} />
                </td>
                <td>
                  <div className="w-full flex gap-4">
                    {val.is_request === true && val.status === "pending" && (
                      <div>
                        <Button
                          variants="primary"
                          onClick={() => {
                            setIsOpen(true);
                            setOrderId(val.id);
                          }}
                        >
                          Accept
                        </Button>
                      </div>
                    )}

                    <div>
                      <Button
                        variants="secondary"
                        onClick={() =>
                          push(`/admin/pharmacy/stock-mutation/${val.id}`)
                        }
                      >
                        Detail
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
        </Table>
        <div className="flex w-full justify-center my-8">
          {mutationList.data && (
            <Pagination
              totalPage={mutationList.data.total_page}
              activePage={mutationList.data.current_page}
              setPage={setPage}
            />
          )}
        </div>
      </PharmacyLayout>
    </>
  );
}

export default MutationHistory;
