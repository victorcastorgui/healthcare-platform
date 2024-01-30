import Button from "@/components/Button/Button";
import PharmacyProductCard from "@/components/Card/PharmacyProductCard";
import AdminHeader from "@/components/Header/AdminHeader";
import { InputField } from "@/components/Input/InputField";
import SearchSelectField from "@/components/Input/SearchSelectField";
import PharmacyLayout from "@/components/Layout/PharmacyLayout";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { useFetch } from "@/hooks/useFetch";
import useProduct from "@/hooks/useProduct";
import { regOnlyChars } from "@/lib/regexLib";
import { BaseProductDetail, PostResponse, SelectSearch } from "@/types";
import { getToken } from "@/utils/token";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type ProductForm = {
  product_id: string;
  stock: string;
  price: string;
};

const AddProductPharmacy = () => {
  const router = useRouter();
  const pharmacyId = router.query.pharmacy;
  const { selectSearchProduct } = useProduct("pharmacy");
  const token = getToken();
  const {
    data,
    fetchData: postProduct,
    error,
    isLoading,
    errorMsg,
  } = useFetch();
  const [productForm, setProductForm] = useState<ProductForm>({
    product_id: "",
    stock: "",
    price: "",
  });
  const [formError, setFormError] = useState<ProductForm>({
    product_id: "",
    stock: "",
    price: "",
  });
  const [selectVal, setSelectVal] = useState<SelectSearch>();
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const productDetail = useCustomSWR<BaseProductDetail>(
    selectVal !== undefined
      ? `${apiBaseUrl}/products/${selectVal.value}/admin`
      : null
  );

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(regOnlyChars, "");

    if (e.target.name === "stock" && e.target.value.length > 3) {
      return;
    }
    setFormError((prevData) => {
      return {
        ...prevData,
        [e.target.name]: "",
      };
    });

    setProductForm((prevData) => {
      return {
        ...prevData,
        [e.target.name]: value,
      };
    });
  };

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      productForm.product_id !== "" &&
      productForm.stock !== "" &&
      productForm.price !== "" &&
      productForm.stock !== "0" &&
      productForm.price !== "0" &&
      formError.product_id === "" &&
      formError.stock === "" &&
      formError.price === ""
    ) {
      const URL = `${apiBaseUrl}/pharmacies/${pharmacyId}/products`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: parseInt(productForm.product_id),
          stock: parseInt(productForm.stock),
          price: productForm.price,
          is_active: true,
        }),
      };
      await postProduct(URL, options);
      return;
    }
    if (
      productForm.stock === "" ||
      productForm.price === "" ||
      productForm.product_id === ""
    ) {
      setFormError({
        product_id: "Field must be filled!",
        stock: "Field must be filled!",
        price: "Field must be filled!",
      });
    }
    if (parseInt(productForm.stock) === 0) {
      setFormError((prevData) => {
        return {
          ...prevData,
          stock: "Stock must be more than 0.",
        };
      });
    }
    if (parseInt(productForm.price) === 0) {
      setFormError((prevData) => {
        return {
          ...prevData,
          price: "Price must be more than 0.",
        };
      });
    }
  };

  useEffect(() => {
    setFormError((prevData) => {
      return {
        ...prevData,
        product_id: "",
      };
    });
    if (selectVal !== undefined) {
      setProductForm((prevData) => {
        return {
          ...prevData,
          product_id: selectVal.value.toString(),
        };
      });
    }
  }, [selectVal]);

  useEffect(() => {
    const res = data as PostResponse;
    if (res.message === "created success") {
      toast.success("Add product successfull!");
      if (!isLoading) {
        router.back();
      }
      return;
    }
    if (error !== null && errorMsg !== "") {
      toast.error(errorMsg);
    }
  }, [data, error, router, isLoading, errorMsg]);

  useEffect(() => {
    for (const k in formError) {
      const key = k as keyof ProductForm;
      if (
        (productForm[key] === "" || productForm[key] !== "") &&
        formError[key] === ""
      ) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    }
  }, [formError, productForm]);

  return (
    <PharmacyLayout>
      <Head>
        <title>Add Product | Pharmacy</title>
      </Head>
      <AdminHeader>Add Product to Pharmacy</AdminHeader>
      <div className="mt-8 flex flex-col gap-4 max-lg:items-center">
        <div className="flex w-full justify-start">
          <div className="w-16">
            <Button onClick={() => router.back()} variants="secondary">
              Back
            </Button>
          </div>
        </div>
        <form className="w-full" onSubmit={handleOnSubmit}>
          <div className="w-full">
            <SearchSelectField
              labelName="Select Product"
              data={selectSearchProduct}
              value={selectVal as SelectSearch}
              setValue={setSelectVal}
              reportName="name"
              err={formError.product_id}
            />
          </div>
          <div className="w-full flex flex-col lg:flex-row lg:gap-6">
            <InputField
              type="text"
              name="stock"
              value={productForm.stock}
              onChange={handleOnChange}
              label="Stock"
              err={formError.stock}
            />
            <InputField
              type="text"
              name="price"
              value={productForm.price}
              onChange={handleOnChange}
              label="Price (Rupiah)"
              err={formError.price}
            />
          </div>
          <div className="flex w-full justify-end mt-8">
            <div className="w-52">
              <Button
                type="submit"
                variants="primary"
                disabled={isLoading || isButtonDisabled}
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h4 className="font-semibold text-lg">Product Detail</h4>
        {productDetail.error && (
          <div>Error when fetching the data, please refresh the page.</div>
        )}
        {productDetail.data ? (
          <div className="mt-4">
            <PharmacyProductCard productData={productDetail.data} />
          </div>
        ) : (
          <p>Choose the product to see the detail.</p>
        )}
      </div>
    </PharmacyLayout>
  );
};

export default AddProductPharmacy;
