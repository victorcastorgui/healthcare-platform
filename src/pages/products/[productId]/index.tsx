import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Spinner from "@/components/Loading/Spinner";
import Button from "@/components/Button/Button";
import ProductDesc from "@/components/ProductDetail/ProductDesc";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { Product } from "@/types";
import { apiBaseUrl } from "@/config";
import ProductDimension from "@/components/ProductDetail/ProductDimension";
import { useFetch } from "@/hooks/useFetch";
import { getRoleId, getToken } from "@/utils/token";
import { toast } from "sonner";
import { regNumberMoreThanZero } from "@/lib/regexLib";
import { useDrugForm } from "@/hooks/useDrugForm";
import useProdCategory from "@/hooks/useProdCategory";
import useDrugClassification from "@/hooks/useDrugClassification";
import { getKey } from "@/lib/getKey";

function ProductDetail() {
  const [qty, setQty] = useState<string>("1");
  const router = useRouter();
  const { objDrugClassification } = useDrugClassification();
  const { objDrugForm } = useDrugForm();
  const { objProdCategory } = useProdCategory();

  const token = getToken();
  const roleId = getRoleId();

  const product = useCustomSWR<Product>(
    router.query.productId !== undefined
      ? `${apiBaseUrl}/products/${router.query.productId}`
      : null
  );
  const { data, fetchData } = useFetch();
  const cart = useCustomSWR<Product>(
    token && roleId === "1" ? `${apiBaseUrl}/cart` : null
  );

  useEffect(() => {
    if (data) {
      toast.success("Product has been added to your shopping cart");
      cart.mutate();
    }
  }, [data]);

  const addToCart = async () => {
    await fetchData(`${apiBaseUrl}/cart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: Number(router.query.productId),
        qty: Number(qty),
      }),
    });
  };

  const handleQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (regNumberMoreThanZero.test(e.target.value) || e.target.value === "") {
      setQty(e.target.value);
    }
  };

  return (
    <section className="max-w-screen-sm md:max-w-screen-md px-4 md:mx-auto h-full grid justify-items-center md:items-start grid-cols-1 md:grid-cols-3 gap-6 pt-32 pb-12">
      {product.error && (
        <div>Error getting the data, please refresh the page</div>
      )}
      {product.isLoading && <Spinner />}
      {product.data && product.data.data && (
        <>
          <div className="max-w-sm p-2 mx-auto bg-white border w-full border-gray-200 rounded-2xl shadow">
            <Image
              src={product.data.data.image}
              alt={product.data.data.name}
              width={320}
              height={320}
            />
          </div>
          <div className="max-w-sm md:max-w-lg w-full px-10 py-6 col-span-2 bg-white border border-gray-200 rounded-2xl shadow">
            <h2 className=" text-3xl font-semibold text-[#00383F] mb-2">
              {product.data.data.name}
            </h2>
            <div className="text-xl font-semibold text-[#36A5B2]">
              {formatToRupiah(Number(product.data.data.floor_price))} -{" "}
              {formatToRupiah(Number(product.data.data.top_price))}
            </div>
            <div className="text-[#999999] text-sm mt-2 mb-4">
              per {product.data.data.unit_in_pack}
            </div>

            {token && roleId === "1" ? (
              <>
                <div className="flex gap-3 items-center justify-start max-w-fit mb-3">
                  <Button
                    className="font-medium rounded-lg text-primary px-3 py-0.5 border border-primary hover:bg-primary hover:text-white disabled:bg-gray-300 disabled:border-gray-200 disabled:text-white"
                    onClick={() => setQty(String(Number(qty) - 1))}
                    disabled={Number(qty) <= 1}
                  >
                    -
                  </Button>

                  <input
                    name="quantity"
                    type="text"
                    value={qty}
                    className="text-black input text-center input-bordered max-w-12 px-2 py-1 h-fit"
                    onChange={(e) => handleQty(e)}
                  />

                  <Button
                    className="font-medium rounded-lg text-primary px-3 py-0.5 border border-primary hover:bg-primary hover:text-white"
                    onClick={() => setQty(String(Number(qty) + 1))}
                  >
                    +
                  </Button>
                </div>

                <Button
                  variants="primary"
                  onClick={addToCart}
                  disabled={Number(qty) < 1}
                >
                  Add to cart
                </Button>
              </>
            ) : (
              <hr className="h-px mt-5 mb-6 bg-gray-200 border-0"></hr>
            )}

            <div className="mt-8">
              <ProductDesc
                title="Description"
                desc={product.data.data.detail}
              />
            </div>
            <div className="mt-4">
              <ProductDesc
                title="Selling Unit"
                desc={product.data.data.selling_unit}
              />
            </div>
            {product.data.data.generic_name && (
              <div className="mt-4">
                <ProductDesc
                  title="Generic Name"
                  desc={product.data.data.generic_name}
                />
              </div>
            )}
            {product.data.data.drug_form_id && (
              <div className="mt-4">
                <ProductDesc
                  title="Product Form"
                  desc={getKey(objDrugForm, product.data.data.drug_form_id)!}
                />
              </div>
            )}
            <div className="mt-4">
              <ProductDesc
                title="Product Category"
                desc={
                  getKey(
                    objProdCategory,
                    product.data.data.product_category_id
                  )!
                }
              />
            </div>
            {product.data.data.drug_classification_id && (
              <div className="mt-4">
                <ProductDesc
                  title="Product classification"
                  desc={
                    getKey(
                      objDrugClassification,
                      product.data.data.drug_classification_id
                    )!
                  }
                />
              </div>
            )}

            <div className="mt-4">
              <ProductDimension
                width={product.data.data.width}
                height={product.data.data.height}
                weight={product.data.data.weight}
                length={product.data.data.length}
              />
            </div>
            <div className="mt-4">
              <ProductDesc
                title="Manufacture"
                desc={product.data.data.manufacture}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default ProductDetail;
