import Button from "@/components/Button/Button";
import BaseCard from "@/components/Card/BaseCard";
import { InputField } from "@/components/Input/InputField";
import React, { useEffect } from "react";
import Image from "next/image";
import { Products } from "@/types";
import Spinner from "@/components/Loading/Spinner";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { formatToTitleCase } from "@/utils/formatter/formatToTitleCase";
import Pagination from "@/components/Pagination/Pagination";
import SortOrder from "@/components/Sort/SortOrder";
import { orderBy } from "@/lib/orderBy";
import { useRouter } from "next/router";
import Head from "next/head";
import { useFilter } from "@/hooks/useFilter";
import { limit } from "@/lib/dataLimit";
import useProdCategory from "@/hooks/useProdCategory";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { toast } from "sonner";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { useFetch } from "@/hooks/useFetch";
import { apiBaseUrl } from "@/config";

const ProductList = ({
  token,
  roleId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const sortBy = ["Name", "Price"];
  const router = useRouter();
  const defaultSortTitle = sortBy[0];
  const filterParam = "category";
  const searchBy = "name";

  const { objProdCategory, arrProdCategory } = useProdCategory();

  const {
    swrResponse: products,
    searchInput,
    sortTitle,
    setSortTitle,
    orderTitle,
    setOrderTitle,
    setPage,
    filterTitle,
    setFilterTitle,
    handleSearchInput,
  } = useFilter<Products>(
    token !== null ? "products/nearby" : "products",
    searchBy,
    defaultSortTitle,
    limit,
    filterParam,
    objProdCategory
  );
  const { data: dataCart, fetchData: fetchCart } = useFetch();
  const cart = useCustomSWR(
    token && Number(roleId) === 1 ? `${apiBaseUrl}/cart` : null
  );

  useEffect(() => {
    if (dataCart) {
      toast.success("Product success add to cart!");
      cart.mutate();
    }
  }, [dataCart]);

  const addToCart = async (id: number) => {
    if (token && Number(roleId) === 1) {
      await fetchCart(`${apiBaseUrl}/cart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: id,
          qty: 1,
        }),
      });
      return;
    }
    router.push("/auth/login");
    toast.error("Cannot add product to cart! You must login first:)");
  };

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <div className="py-24 w-11/12 lg:w-4/5 m-auto max-w-screen-xl">
        <h1 className="text-center mt-16 text-primary-text font-semibold text-3xl">
          Products
        </h1>
        {products.error && (
          <div>Error getting the data, please refresh the page</div>
        )}
        {products.isLoading && <Spinner />}
        <div className="flex flex-col sm:flex-row w-full justify-between sm:items-center mt-10">
          <div className="flex items-center text-sm gap-4 ">
            <SortOrder
              sortBy={sortBy}
              orderBy={orderBy}
              sortTitle={sortTitle}
              setSortTitle={setSortTitle}
              orderTitle={orderTitle}
              setOrderTitle={setOrderTitle}
              filterSectionTitle="Product Category"
              filterBy={arrProdCategory}
              filterTitle={filterTitle}
              setFilterTitle={setFilterTitle}
            />
          </div>
          <div>
            <InputField
              type="text"
              variants="small"
              name="name"
              placeholder="Search by name"
              value={searchInput}
              onChange={handleSearchInput}
            />
          </div>
        </div>
        {products.data && products.data.data !== null ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-4">
              {products.data.data.map((product, idx) => (
                <div key={idx}>
                  <BaseCard>
                    <div
                      className="flex flex-col gap-8 cursor-pointer h-72"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      <div className="relative w-[150px] h-[150px] mx-auto">
                        <Image
                          src={product.image}
                          fill
                          sizes="100%"
                          className="object-cover"
                          alt="Picture of Zegavit Vitamin"
                          priority
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-xl">
                          {formatToTitleCase(product.name)}
                        </h3>
                        <p>
                          {`${formatToRupiah(
                            parseInt(product.floor_price)
                          )} - ${formatToRupiah(parseInt(product.top_price))}`}
                          <span className="text-gray-400 ml-2">
                            {product.selling_unit.toLowerCase()}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-8">
                      <Button
                        variants="primary"
                        onClick={() => addToCart(product.id ? product.id : 0)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </BaseCard>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-28">
              <Pagination
                totalPage={products.data.total_page}
                activePage={products.data.current_page}
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
                There is no product nearby your location. Please add new address
              </div>
            </BaseCard>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;

export const getServerSideProps: GetServerSideProps<{
  token: string | undefined | null;
  roleId: string | undefined | null;
}> = async (context) => {
  let token: string | undefined | null = context.req.cookies["token"];
  let roleId: string | undefined | null = context.req.cookies["roleId"];
  if (token === undefined) {
    token = null;
  }
  if (roleId === undefined) {
    roleId = null;
  }
  return {
    props: {
      token: token,
      roleId: roleId,
    },
  };
};
