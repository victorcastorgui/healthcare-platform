import BackButton from "@/components/Button/BackButton";
import Button from "@/components/Button/Button";
import BaseCard from "@/components/Card/BaseCard";
import { InputField } from "@/components/Input/InputField";
import SearchSelectField from "@/components/Input/SearchSelectField";
import PharmacyLayout from "@/components/Layout/PharmacyLayout";
import { apiBaseUrl } from "@/config";
import { useFetch } from "@/hooks/useFetch";
import usePharmacies from "@/hooks/usePharmacies";
import useProductPharmacy from "@/hooks/useProductPharmacy";
import { SelectSearch } from "@/types";
import { getToken } from "@/utils/token";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const AddStockRecord = () => {
  const [quantity, setQuantity] = useState("");
  const [isReduction, setIsReduction] = useState(false);
  const [pharmacy, setPharmacy] = useState<SelectSearch>();
  const [product, setProduct] = useState<SelectSearch>();
  const [errors, setErrors] = useState({
    quantity: "",
    isReduction: "",
  });
  const token = getToken();
  const router = useRouter();

  const { data, setData, error, setErrorMsg, errorMsg, fetchData } = useFetch();
  const { selectSearchPharmacies } = usePharmacies("pharmacy");
  const { selectSearchProduct } = useProductPharmacy(pharmacy?.value as number);

  useEffect(() => {
    if (data) {
      toast.success("Success create stock record!");
      router.push("/admin/pharmacy/stock-record");
      setData(null);
    }

    if (errorMsg) {
      toast.error(errorMsg);
      setErrorMsg("");
    }
  }, [data, errorMsg]);

  useEffect(() => {
    if (selectSearchPharmacies !== undefined && pharmacy === undefined) {
      setPharmacy(selectSearchPharmacies[0]);
    }
  }, [selectSearchPharmacies, pharmacy]);

  useEffect(() => {
    if (selectSearchProduct !== undefined && product === undefined) {
      setProduct(selectSearchProduct[0]);
    }
  }, [product, selectSearchProduct]);

  const handleQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value);

    setErrors({
      ...errors,
      quantity: !value.trim() ? "Input required and must number" : "",
    });
  };

  const validateForm = () => {
    const newErrors = {
      quantity: !quantity.trim() ? "Input required and must be a number" : "",
      isReduction:
        String(isReduction) === "Choose reduction" ? "Input required" : "",
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = validateForm();

    if (isFormValid) {
      await fetchData(`${apiBaseUrl}/stock-records`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pharmacy_product_id: product?.value,
          quantity: Number(quantity),
          is_reduction: isReduction,
        }),
      });
      return;
    }

    toast.error("Please fill all required fields correctly.");
  };

  return (
    <PharmacyLayout>
      <Head>
        <title>Create Stock Record | Pharmacy</title>
      </Head>
      <BackButton route="/admin/pharmacy/stock-record" />

      <BaseCard customStyle="max-w-full mt-12">
        <h2 className="text-3xl font-semibold max-lg:text-center mb-6">
          Create Stock Record
        </h2>
        <form onSubmit={handleSubmit}>
          {pharmacy && selectSearchPharmacies && product && (
            <div className="grid grid-cols-2 gap-4">
              <SearchSelectField
                data={selectSearchPharmacies}
                labelName="Select pharmacy:"
                reportName="pharmacy"
                value={pharmacy}
                setValue={setPharmacy}
              />
              {selectSearchProduct.length !== 0 && (
                <>
                  <SearchSelectField
                    data={selectSearchProduct}
                    labelName="Select product:"
                    reportName="products"
                    value={product}
                    setValue={setProduct}
                  />

                  <InputField
                    label="Quantity"
                    name="quantity"
                    type="number"
                    placeholder="1"
                    value={quantity}
                    onChange={(e) => handleQuantity(e)}
                    err={errors.quantity}
                  />
                  <div className="form-control max-w-fit py-9">
                    <label className="label justify-start gap-4 cursor-pointer">
                      <span className="label-text font-semibold">
                        Set as reduction
                      </span>
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={isReduction}
                        className="toggle toggle-accent"
                        onChange={(e) => setIsReduction(e.target.checked)}
                      />
                    </label>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="max-w-48 mt-8">
            <Button
              variants="primary"
              type="submit"
              disabled={selectSearchProduct.length === 0}
            >
              Submit
            </Button>
          </div>
        </form>
      </BaseCard>
    </PharmacyLayout>
  );
};

export default AddStockRecord;
