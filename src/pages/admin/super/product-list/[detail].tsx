import BackButton from "@/components/Button/BackButton";
import AdminHeader from "@/components/Header/AdminHeader";
import AdminLayout from "@/components/Layout/AdminLayout";
import Spinner from "@/components/Loading/Spinner";
import ProductDesc from "@/components/ProductDetail/ProductDesc";
import ProductDimension from "@/components/ProductDetail/ProductDimension";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import useDrugClassification from "@/hooks/useDrugClassification";
import { useDrugForm } from "@/hooks/useDrugForm";
import useProdCategory from "@/hooks/useProdCategory";
import { getKey } from "@/lib/getKey";
import { ProductSuper } from "@/types";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

function ProductDetail() {
  const { query } = useRouter();
  const { objDrugClassification } = useDrugClassification();
  const { objDrugForm } = useDrugForm();
  const { objProdCategory } = useProdCategory();
  const url = `${apiBaseUrl}/products/${query.detail}/admin`;
  const {
    data: productDetail,
    error,
    isLoading,
  } = useCustomSWR<ProductSuper>(query.detail !== undefined ? url : null);

  return (
    <AdminLayout>
      <Head>
        <title>Product List Detail</title>
      </Head>
      <AdminHeader>Product Detail</AdminHeader>
      <br />
      <BackButton route="/admin/super/product-list" />
      <section className="max-w-screen-sm md:max-w-screen-md px-4 md:mx-auto h-full grid justify-items-center md:items-start grid-cols-1 md:grid-cols-3 gap-6 pt-8 pb-12">
        {error && <div>Error getting the data, please refresh the page</div>}
        {isLoading && <Spinner />}
        {productDetail && (
          <>
            <div className="max-w-sm p-2 mx-auto bg-white border w-full border-gray-200 rounded-2xl shadow">
              <Image
                src={productDetail.data.image}
                alt={productDetail.data.name}
                width={320}
                height={320}
                priority
              />
            </div>
            <div className="max-w-sm md:max-w-lg w-full px-10 py-6 col-span-2 bg-white border border-gray-200 rounded-2xl shadow">
              <h2 className=" text-3xl font-semibold text-[#00383F] mb-2">
                {productDetail.data.name}
              </h2>
              <div className="text-xl font-semibold text-[#36A5B2]">
                {formatToRupiah(parseInt(productDetail.data.price))}
              </div>
              <div className="text-[#999999] text-sm mt-2 mb-4">
                per {productDetail.data.unit_in_pack}
              </div>
              <div className="mt-4">
                <ProductDesc
                  title="Description"
                  desc={productDetail.data.detail}
                />
              </div>
              <div className="mt-4">
                <ProductDesc
                  title="Selling Unit"
                  desc={productDetail.data.selling_unit}
                />
              </div>
              {productDetail.data.generic_name && (
                <div className="mt-4">
                  <ProductDesc
                    title="Generic Name"
                    desc={productDetail.data.generic_name}
                  />
                </div>
              )}
              {productDetail.data && (
                <div className="mt-4">
                  <ProductDesc
                    title="Product Category"
                    desc={
                      getKey(
                        objProdCategory,
                        productDetail.data.product_category_id
                      )!
                    }
                  />
                </div>
              )}
              {productDetail.data.drug_form_id && (
                <div className="mt-4">
                  <ProductDesc
                    title="Product Form"
                    desc={getKey(objDrugForm, productDetail.data.drug_form_id)!}
                  />
                </div>
              )}
              {productDetail.data.drug_classification_id && (
                <div className="mt-4">
                  <ProductDesc
                    title="Product classification"
                    desc={
                      getKey(
                        objDrugClassification,
                        productDetail.data.drug_classification_id
                      )!
                    }
                  />
                </div>
              )}
              {productDetail.data.content && (
                <div className="mt-4">
                  <ProductDesc
                    title="Content"
                    desc={productDetail.data.content}
                  />
                </div>
              )}

              <div className="mt-4">
                <ProductDimension
                  width={productDetail.data.width}
                  height={productDetail.data.height}
                  weight={productDetail.data.weight}
                  length={productDetail.data.length}
                />
              </div>
              <div className="mt-4">
                <ProductDesc
                  title="Manufacture"
                  desc={productDetail.data.manufacture}
                />
              </div>
            </div>
          </>
        )}
      </section>
    </AdminLayout>
  );
}

export default ProductDetail;
