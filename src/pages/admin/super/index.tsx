import AreaRechart from "@/components/Chart/AreaRechart";
import GraphRechart from "@/components/Chart/GraphRechart";
import LineRechart from "@/components/Chart/LineRechart";
import AdminHeader from "@/components/Header/AdminHeader";
import SearchSelectField from "@/components/Input/SearchSelectField";
import AdminLayout from "@/components/Layout/AdminLayout";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import usePharmacies from "@/hooks/usePharmacies";
import useProdCategory from "@/hooks/useProdCategory";
import useProduct from "@/hooks/useProduct";
import { SalesReport, SelectSearch } from "@/types";
import { useEffect, useState } from "react";

function SuperHome() {
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
  const { selectSearchPharmacies } = usePharmacies("super");
  const { selectSearchProdCat } = useProdCategory();
  const { selectSearchProduct } = useProduct();

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
    <AdminLayout>
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
    </AdminLayout>
  );
}

export default SuperHome;
