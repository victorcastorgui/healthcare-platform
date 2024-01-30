import BackButton from "@/components/Button/BackButton";
import Button from "@/components/Button/Button";
import AdminHeader from "@/components/Header/AdminHeader";
import { InputField } from "@/components/Input/InputField";
import SearchSelectField from "@/components/Input/SearchSelectField";
import PharmacyLayout from "@/components/Layout/PharmacyLayout";
import { apiBaseUrl } from "@/config";
import { useFetch } from "@/hooks/useFetch";
import usePharmacies from "@/hooks/usePharmacies";
import useProductPharmacy from "@/hooks/useProductPharmacy";
import useProductWPharmacies from "@/hooks/useProductWPharmacies";
import { SelectSearch } from "@/types";
import { getToken } from "@/utils/token";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type QuantityMutation = {
  message: string;
};

function CreateStock() {
  const selectSearchProductDefault: SelectSearch = {
    value: "",
    label: "Choose one...",
  };
  const { push } = useRouter();
  const [toPharmacy, setToPharmacy] = useState<SelectSearch>();
  const [product, setProduct] = useState<SelectSearch>();
  const [fromPharmacy, setFromPharmacy] = useState<SelectSearch>();
  const [qtyError, setQtyError] = useState("");
  const [qty, setQty] = useState<string>("");
  const { selectSearchPharmacies } = usePharmacies("pharmacy");
  const { selectSearchProduct } = useProductPharmacy(
    toPharmacy === undefined ? 1 : (toPharmacy.value as number)
  );
  const token = getToken();
  const { selectSearchProductWPharmacies } = useProductWPharmacies(
    product === undefined ? 1 : (product.value as number)
  );
  const {
    data,
    fetchData: createData,
    errorMsg,
  } = useFetch<QuantityMutation>();

  useEffect(() => {
    setQtyError("");
  }, [qty]);

  useEffect(() => {
    const response = data as QuantityMutation;
    if (errorMsg !== undefined) {
      if (errorMsg[0] === "insufficient stock request product") {
        toast.error(errorMsg[0]);
      }
    }
    if (data === "") {
      return;
    }
    if (response)
      if (response.message === "created success") {
        toast.success(response.message);
        push("/admin/pharmacy/stock-mutation");
      }
  }, [data, errorMsg]);

  const handleCreate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (parseInt(qty) < 1 || parseInt(qty) > 25 || qty === "") {
      setQtyError("Stock request can only be between 1-25");
      return;
    }

    handleCreateRequest();
  };

  const handleCreateRequest = async () => {
    const URL = `${apiBaseUrl}/stock-mutations`;
    const options = {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        to_pharmacy_product_id: product?.value,
        from_pharmacy: fromPharmacy?.value,
        quantity: parseInt(qty),
      }),
    };
    await createData(URL, options);
  };
  const hasError = qtyError !== "";
  useEffect(() => {
    if (selectSearchPharmacies !== undefined && toPharmacy === undefined) {
      setToPharmacy(selectSearchPharmacies[0]);
    }
  }, [toPharmacy, selectSearchPharmacies]);

  useEffect(() => {
    if (selectSearchProduct !== undefined && product === undefined) {
      setProduct(selectSearchProduct[0]);
    }
  }, [product, selectSearchProduct]);

  useEffect(() => {
    if (
      selectSearchProductWPharmacies !== undefined &&
      fromPharmacy === undefined
    ) {
      setFromPharmacy(selectSearchProductWPharmacies[0]);
    }
  }, [fromPharmacy, selectSearchProductWPharmacies]);

  return (
    <PharmacyLayout>
      <Head>
        <title>Create Stock Mutation</title>
      </Head>
      <AdminHeader>Create Stock Mutation</AdminHeader>
      <br />
      <BackButton route="/admin/pharmacy/stock-mutation" />
      <br />
      <form onSubmit={(e) => handleCreate(e)}>
        {selectSearchPharmacies && toPharmacy && (
          <SearchSelectField
            data={selectSearchPharmacies}
            labelName="To:"
            value={toPharmacy}
            setValue={setToPharmacy}
            reportName="pharmacyTo"
          />
        )}
        {selectSearchProduct.length !== 0 && (
          <>
            {selectSearchPharmacies && product && (
              <SearchSelectField
                data={selectSearchProduct}
                labelName="Product:"
                value={product!}
                setValue={setProduct}
                reportName="product"
              />
            )}

            {selectSearchProductWPharmacies && fromPharmacy && (
              <SearchSelectField
                data={selectSearchProductWPharmacies}
                labelName="From:"
                value={fromPharmacy}
                setValue={setFromPharmacy}
                reportName="pharmacyFrom"
              />
            )}
            <InputField
              type="number"
              name="number"
              value={qty as string}
              onChange={(e) => setQty(e.target.value)}
              label="Quantity:"
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) &&
                evt.preventDefault()
              }
              err={qtyError}
            />
          </>
        )}

        <Button
          variants="primary"
          type="submit"
          disabled={hasError || selectSearchProduct.length === 0}
        >
          Create
        </Button>
      </form>
    </PharmacyLayout>
  );
}

export default CreateStock;
