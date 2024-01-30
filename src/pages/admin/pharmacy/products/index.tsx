import Button from "@/components/Button/Button";
import AdminHeader from "@/components/Header/AdminHeader";
import { InputField } from "@/components/Input/InputField";
import PharmacyLayout from "@/components/Layout/PharmacyLayout";
import Spinner from "@/components/Loading/Spinner";
import FormModal from "@/components/Modal/FormModal";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { apiBaseUrl } from "@/config";
import { useFetch } from "@/hooks/useFetch";
import { useFilter } from "@/hooks/useFilter";
import usePharmacies from "@/hooks/usePharmacies";
import useProdCategory from "@/hooks/useProdCategory";
import { adminTableNumbering } from "@/lib/adminTableNumbering";
import { getKey } from "@/lib/getKey";
import { regOnlyChars } from "@/lib/regexLib";
import {
  PostResponse,
  ProductPharmacy,
  ResponseError,
  SelectSearch,
} from "@/types";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { getToken } from "@/utils/token";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { toast } from "sonner";

type UpdateForm = {
  id: number;
  price: string;
  is_active: boolean;
};

const Products = () => {
  const tableHeads = [
    "",
    "Product Name",
    "Product Category",
    "Stock",
    "Price",
    "Is Active",
    "",
  ];
  const role = "pharmacy";
  const searchParam = "name";
  const defaultSortTitle = "Name";
  const limit = 5;
  const sortBy = ["Name", "Price", "Stock"];
  const filterParam = "category";
  const router = useRouter();
  const token = getToken();
  const [selectPhar, setSelectPhar] = useState<SelectSearch>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [updatedForm, setUpdatedForm] = useState<UpdateForm>({
    id: 0,
    price: "",
    is_active: false,
  });
  const [updatedPrice, setUpdatedPrice] = useState<string>("");
  const [updatedPriceError, setUpdatedPriceError] = useState<string>("");
  const [isFirstOpened, setIsFirstOpened] = useState<boolean>(true);
  const [updatedProdName, setUpdatedProdName] = useState<string>("");
  const { selectSearchPharmacies } = usePharmacies(role);
  const { arrProdCategory, objProdCategory } = useProdCategory();
  const { fetchData: putActive, data, isLoading, error } = useFetch();

  const handleOnChangeSelect = (e: SingleValue<SelectSearch>) => {
    if (e !== null) {
      setSelectPhar(e);
    }
  };

  const handleOnChangeUpdatePrice = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedPriceError("");
    const value = e.target.value.replace(regOnlyChars, "");
    setUpdatedPrice(value);
    if (isFirstOpened) {
      setIsFirstOpened(false);
    }
  };

  const handleUpdatePrice = () => {
    if (updatedPrice === "") {
      return;
    }
    handleUpdate();
    setIsModalOpen(false);
  };

  const handleUpdate = async () => {
    if (selectPhar !== undefined && token !== undefined) {
      const url = `${apiBaseUrl}/pharmacies/${selectPhar.value}/products/${updatedForm.id}`;
      const body = updatedForm;
      if (updatedPrice !== "") {
        body.price = updatedPrice;
      }
      const options = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      };
      await putActive(url, options);
      pharmacyProd.mutate();
    }
  };

  const {
    swrResponse: pharmacyProd,
    searchInput,
    handleSearchInput,
    sortTitle,
    setSortTitle,
    orderTitle,
    setOrderTitle,
    filterTitle,
    setFilterTitle,
    setPage,
  } = useFilter<ProductPharmacy & ResponseError>(
    `pharmacies/${selectPhar !== undefined ? selectPhar.value : "1"}/products`,
    searchParam,
    defaultSortTitle,
    limit,
    filterParam,
    objProdCategory
  );

  useEffect(() => {
    if (
      (updatedForm.price === updatedPrice || parseInt(updatedPrice) === 0) &&
      !isFirstOpened
    ) {
      setUpdatedPriceError("Cannot enter the same price or 0!");
      setIsButtonDisabled(true);
      return;
    }
    setIsButtonDisabled(false);
  }, [updatedPrice, updatedForm.price, isFirstOpened]);

  useEffect(() => {
    if (isSubmit) {
      handleUpdate();
      setTimeout(() => {
        setIsSubmit(false);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmit]);

  useEffect(() => {
    if (selectSearchPharmacies !== undefined && selectPhar === undefined) {
      setSelectPhar(selectSearchPharmacies[0]);
    }
  }, [selectSearchPharmacies, selectPhar]);

  useEffect(() => {
    const res = data as PostResponse;
    if (res.message === "updated success") {
      toast.success("Update product success!");
    }
    if (error !== null) {
      toast.error("update failed! Please check your server.");
    }
  }, [data, error, router]);

  return (
    <>
      {isModalOpen && (
        <FormModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handleOnSubmit={handleUpdatePrice}
          isLoading={isLoading}
          isButtonDisabled={isButtonDisabled || isLoading}
        >
          <p>
            Product Name: <span className="font-medium">{updatedProdName}</span>
          </p>
          <InputField
            type="text"
            name="price"
            label="Price (Rupiah)"
            value={updatedPrice}
            onChange={handleOnChangeUpdatePrice}
            err={updatedPriceError}
          />
        </FormModal>
      )}
      <PharmacyLayout>
        <Head>
          <title>Manage Products | Pharmacy</title>
        </Head>
        <AdminHeader>Manage Products</AdminHeader>
        <div className="w-full mt-10 flex flex-col gap-2 -mb-4">
          <p className="font-medium">Select pharmacy:</p>
          {selectPhar !== undefined ? (
            <Select
              instanceId={selectPhar.value}
              name="pharmacy"
              options={selectSearchPharmacies}
              value={selectPhar}
              onChange={handleOnChangeSelect}
            />
          ) : (
            <Spinner />
          )}
        </div>
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
          filterBy={arrProdCategory}
          filterSectionTitle="Product Category"
          componentBesideSearch={
            <Button
              onClick={() =>
                router.push(
                  `/admin/pharmacy/products/add?pharmacy=${
                    selectPhar !== undefined ? selectPhar.value : "1"
                  }`
                )
              }
              variants="primary"
            >
              Add Product
            </Button>
          }
        >
          {pharmacyProd.error && (
            <div>Error when fetching the data, please refresh the page</div>
          )}
          {pharmacyProd.data && pharmacyProd.data.error ? (
            <div>Pharmacy not found.</div>
          ) : (
            pharmacyProd.data &&
            pharmacyProd.data.data.map((prod, idx) => (
              <tr key={idx}>
                <td>
                  {pharmacyProd.data &&
                    adminTableNumbering(pharmacyProd.data.current_page, idx)}
                </td>
                <td>{prod.product.name}</td>
                <td>
                  {getKey(objProdCategory, prod.product.product_category_id)}
                </td>
                <td>{prod.stock}</td>
                <td>{formatToRupiah(parseInt(prod.price))}</td>
                <td>{prod.is_active ? "Yes" : "No"}</td>
                <td className="flex gap-4">
                  <div className="w-full">
                    <Button
                      variants="secondary"
                      onClick={() => {
                        setIsModalOpen(true);
                        setUpdatedForm({
                          id: prod.id,
                          price: prod.price,
                          is_active: prod.is_active,
                        });
                        setUpdatedProdName(prod.product.name);
                        setUpdatedPrice(prod.price);
                      }}
                    >
                      Edit Price
                    </Button>
                  </div>
                  <div className="w-full">
                    <Button
                      variants={prod.is_active ? "danger" : "secondary"}
                      onClick={() => {
                        setUpdatedForm({
                          id: prod.id,
                          price: prod.price,
                          is_active: !prod.is_active,
                        });
                        setIsSubmit(true);
                      }}
                    >
                      {prod.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </Table>
        {pharmacyProd.data && (
          <div className="flex w-full justify-center my-8">
            <Pagination
              totalPage={pharmacyProd.data.total_page}
              activePage={pharmacyProd.data.current_page}
              setPage={setPage}
            />
          </div>
        )}
      </PharmacyLayout>
    </>
  );
};

export default Products;
