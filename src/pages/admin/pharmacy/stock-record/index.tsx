import Button from "@/components/Button/Button";
import PharmacyLayout from "@/components/Layout/PharmacyLayout";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { useFilter } from "@/hooks/useFilter";
import { adminTableNumbering } from "@/lib/adminTableNumbering";
import { arrStockRecord, objStockRecord } from "@/lib/filterBy";
import { ResponseError, TStockRecord } from "@/types";
import moment from "moment";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const StockMutation = () => {
  const tableHeads = [
    "",
    "",
    "Product Name",
    "Product Category",
    "Pharmacy Name",
    "Quantity",
    "Reduction",
    "Last Update",
  ];
  const searchParam = "name";
  const defaultSortTitle = "Name";
  const limit = 4;
  const sortBy = ["Name", "Quantity"];
  const filterParam = "is_reduction";
  const router = useRouter();

  const {
    swrResponse: pharmacyStock,
    searchInput,
    handleSearchInput,
    sortTitle,
    setSortTitle,
    orderTitle,
    setOrderTitle,
    filterTitle,
    setFilterTitle,
    setPage,
  } = useFilter<TStockRecord & ResponseError>(
    `stock-records`,
    searchParam,
    defaultSortTitle,
    limit,
    filterParam,
    objStockRecord
  );

  return (
    <PharmacyLayout>
      <Head>
        <title>Stock Record | Pharmacy</title>
      </Head>
      <h2 className="text-3xl font-bold max-lg:text-center">Stock Record</h2>
      <Table
        tableHeads={tableHeads}
        searchInput={searchInput}
        searchName="Seach by product name"
        handleSearchInput={handleSearchInput}
        sortBy={sortBy}
        sortTitle={sortTitle}
        setSortTitle={setSortTitle}
        orderTitle={orderTitle}
        setOrderTitle={setOrderTitle}
        filterTitle={filterTitle}
        setFilterTitle={setFilterTitle}
        filterSectionTitle="Status"
        filterBy={arrStockRecord}
        componentBesideSearch={
          <Button
            onClick={() => {
              router.push(`/admin/pharmacy/stock-record/add`);
            }}
            variants="primary"
          >
            Add Stock Record
          </Button>
        }
      >
        {pharmacyStock.error && (
          <div>Error when fetching the data, please refresh the page</div>
        )}
        {pharmacyStock.data &&
          pharmacyStock.data.data.map((val, i) => {
            return (
              <tr key={`stockRecord-${val.id}`}>
                <td>
                  {pharmacyStock.data &&
                    adminTableNumbering(pharmacyStock.data.current_page, i)}
                </td>
                <td className="max-w-40">
                  <Image
                    src={val.product.image}
                    alt={val.product.name}
                    width={80}
                    height={80}
                  />
                </td>
                <td className="max-w-48">{val.product.name}</td>
                <td>{val.product.category_name}</td>
                <td>{val.pharmacy_name}</td>
                <td>{val.quantity}</td>
                <td>{val.is_reduction ? "Yes" : "No"}</td>
                <td>{moment(val.change_at).format("DD-MM-YYYY hh:mm A")}</td>
              </tr>
            );
          })}
      </Table>

      {pharmacyStock.data && (
        <div className="flex w-full justify-center my-8">
          <Pagination
            totalPage={pharmacyStock.data.total_page}
            activePage={pharmacyStock.data.current_page}
            setPage={setPage}
          />
        </div>
      )}
    </PharmacyLayout>
  );
};

export default StockMutation;
