import AreaRechart from "@/components/Chart/AreaRechart";
import GraphRechart from "@/components/Chart/GraphRechart";
import LineRechart from "@/components/Chart/LineRechart";
import AdminHeader from "@/components/Header/AdminHeader";
import SearchSelectField from "@/components/Input/SearchSelectField";
import PharmacyLayout from "@/components/Layout/PharmacyLayout";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { useFilter } from "@/hooks/useFilter";
import usePharmacies from "@/hooks/usePharmacies";
import useProdCategory from "@/hooks/useProdCategory";
import useProduct from "@/hooks/useProduct";
import { adminTableNumbering } from "@/lib/adminTableNumbering";
import { SalesReport, SelectSearch, StockRecordMonthly } from "@/types";
import { useEffect, useState } from "react";

function PharmacyHome() {
  const [pharmacy, setPharmacy] = useState<SelectSearch>();
  const [product, setProduct] = useState<SelectSearch>();
  const [productCategory, setProductCategory] = useState<SelectSearch>();
  const url = `${apiBaseUrl}/order/monthly-sales?pharmacy=${pharmacy?.value}&product=${product?.value}&product_category=${productCategory?.value}`;
  const { data: salesReport } = useCustomSWR<SalesReport>(
    pharmacy !== undefined &&
      product !== undefined &&
      productCategory !== undefined
      ? url
      : null
  );
  const { selectSearchPharmacies } = usePharmacies("pharmacy");
  const { selectSearchProdCat } = useProdCategory();
  const { selectSearchProduct } = useProduct();

  const tableHeads = [
    "",
    "Pharmacy Name",
    "Product Name",
    "Month",
    "Additions",
    "Deductions",
    "Final Stock",
  ];
  const sortBy = [
    "Additions",
    "Deductions",
    "Final Stock",
    "Pharmacy Name",
    "Product Name",
  ];
  const defaultSortTitle = sortBy[0];
  const searchBy = "name";
  const {
    swrResponse: stockTracker,
    handleSearchInput,
    searchInput,
    orderTitle,
    setOrderTitle,
    setPage,
    setSortTitle,
    sortTitle,
  } = useFilter<StockRecordMonthly>(
    "stock-records/monthly",
    searchBy,
    defaultSortTitle,
    5
  );

  useEffect(() => {
    if (selectSearchPharmacies !== undefined && pharmacy === undefined) {
      setPharmacy(selectSearchPharmacies[0]);
    }
  }, [pharmacy, selectSearchPharmacies]);

  useEffect(() => {
    if (selectSearchProdCat !== undefined && productCategory === undefined) {
      setProductCategory(selectSearchProdCat[0]);
    }
  }, [productCategory, selectSearchProdCat]);

  useEffect(() => {
    if (selectSearchProduct !== undefined && product === undefined) {
      setProduct(selectSearchProduct[0]);
    }
  }, [product, selectSearchProduct]);

  return (
    <PharmacyLayout>
      <AdminHeader>Home</AdminHeader>
      {salesReport && pharmacy && product && productCategory && (
        <>
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-8 mt-4 mb-8">
            <div className="col-span-2 max-lg:col-span-1">
              <div className="w-1/2 max-lg:w-full">
                <SearchSelectField
                  labelName="Pharmacy:"
                  reportName="pharmacy"
                  data={selectSearchPharmacies}
                  value={pharmacy}
                  setValue={setPharmacy}
                />
              </div>
              <AreaRechart
                variants="primary"
                data={salesReport!.data.pharmacy_graph}
                xAxisKey="month"
                yAxisKey="total_sales"
                title="Total Sales"
              />
            </div>
            <div>
              <SearchSelectField
                labelName="Product Category:"
                reportName="productCategory"
                data={selectSearchProdCat}
                value={productCategory}
                setValue={setProductCategory}
              />

              <LineRechart
                variants="secondary"
                data={salesReport!.data.product_category_graph}
                xAxisKey="month"
                yAxisKey="total_sales"
                title="Total Sales"
              />
            </div>
            <div>
              <SearchSelectField
                labelName="Product:"
                reportName="product"
                data={selectSearchProduct}
                value={product}
                setValue={setProduct}
              />
              <GraphRechart
                variants="tertiary"
                data={salesReport!.data.product_graph}
                xAxisKey="month"
                yAxisKey="total_sales"
                title="Total Sales"
              />
            </div>
          </div>
        </>
      )}
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
      >
        {stockTracker.error && (
          <div>Error when fetching the data, please refresh the page</div>
        )}
        {stockTracker.data &&
          stockTracker.data.data.map((val, i) => {
            return (
              <tr key={i}>
                <td>
                  {stockTracker.data &&
                    adminTableNumbering(stockTracker.data.current_page, i)}
                </td>
                <td className="max-w-48">{val.pharmacy_name}</td>
                <td>{val.product_name}</td>
                <td>{val.month}</td>
                <td>{val.additions}</td>
                <td>{val.deductions}</td>
                <td>{val.final_stock}</td>
              </tr>
            );
          })}
      </Table>
      {stockTracker.data && (
        <div className="flex w-full justify-center my-8">
          <Pagination
            totalPage={stockTracker.data.total_page}
            activePage={stockTracker.data.current_page}
            setPage={setPage}
          />
        </div>
      )}
    </PharmacyLayout>
  );
}

export default PharmacyHome;
