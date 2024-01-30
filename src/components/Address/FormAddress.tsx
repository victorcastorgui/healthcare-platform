import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import { InputField } from "../Input/InputField";
import { TAddress, TCities, TData, Provinces, ValidAddress } from "@/types";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { apiBaseUrl } from "@/config";
import { getToken } from "@/utils/token";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { validateAddress } from "@/utils/validate";
import dynamic from "next/dynamic";

interface IFormAddress {
  initialState: TAddress;
  setBack: () => void;
}

interface IAddAddressResponse {
  address_id: number;
}

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});
const FormAddress = ({ initialState, setBack }: IFormAddress) => {
  const [formData, setFormData] = useState<TAddress>(
    initialState || {
      name: "",
      street: "",
      postal_code: "",
      phone: "",
      detail: "",
      latitude: "-6.2304177",
      longitude: "106.8236458",
      province_id: 0,
      city_id: 0,
    }
  );

  const [errors, setErrors] = useState({
    name: "",
    street: "",
    postal_code: "",
    phone: "",
    detail: "",
    latitude: "",
    longitude: "",
    province_id: "",
    city_id: "",
  });
  const [isMainAddress, setIsMainAddress] = useState(false);
  const {
    data: newAddress,
    errorMsg: errorNewAddress,
    fetchData: fetchAddress,
  } = useFetch<TData<IAddAddressResponse>>();
  const { data: dataMain, fetchData: fetchMainAddress } = useFetch();
  const address = useCustomSWR(`${apiBaseUrl}/addresses`);
  const allProvinces = useCustomSWR<Provinces[]>(`${apiBaseUrl}/provinces`);
  const allCities = useCustomSWR<TCities>(
    formData.province_id !== 0
      ? `${apiBaseUrl}/provinces/${formData.province_id}`
      : null
  );
  const token = getToken();

  useEffect(() => {
    if (
      formData.province_id !== 0 &&
      formData.city_id !== 0 &&
      allCities.data !== undefined
    ) {
      for (const city of allCities.data.cities) {
        if (city.id === formData.city_id) {
          setFormData((formData) => ({
            ...formData,
            latitude: city.latitude,
            longitude: city.longitude,
          }));
        }
      }
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.city_id]);

  useEffect(() => {
    if ((newAddress && !isMainAddress) || dataMain) {
      toast.success("Success add new address!");
      address.mutate();
      setBack();
    } else if (
      newAddress &&
      typeof newAddress !== "string" &&
      newAddress.data &&
      isMainAddress
    ) {
      const id = newAddress.data.address_id;
      fetchMainAddress(`${apiBaseUrl}/addresses/${id}/default`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setIsMainAddress(false);
    }
    if (errorNewAddress) {
      toast.error(errorNewAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newAddress, errorNewAddress, dataMain]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const errorMessage = validateAddress(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
    const newValue =
      name === "province_id" || name === "city_id" ? Number(value) : value;

    setFormData((formData) => ({ ...formData, [name]: newValue }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    const fieldsToValidate = [
      "name",
      "postal_code",
      "province_id",
      "city_id",
      "street",
      "phone",
    ];

    fieldsToValidate.forEach((fieldName) => {
      const value = formData[fieldName as keyof typeof formData];
      const errorMessage = validateAddress(fieldName, String(value));

      newErrors[fieldName as keyof typeof newErrors] = errorMessage;

      if (errorMessage) {
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = validateForm();

    if (isFormValid) {
      const response = await fetch(`${apiBaseUrl}/addresses/validate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          city_id: formData.city_id,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      });
      const res: ValidAddress = await response.json();
      if (res.data.is_valid) {
        await fetchAddress(`${apiBaseUrl}/addresses`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        toast.error("Chosen city and map pin point is mismatch!");
        return;
      }
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="font-semibold mt-3">Contact Detail</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full justify-between">
        <InputField
          name="name"
          type="text"
          value={formData.name}
          label="Name:"
          placeholder="Input name here.."
          onChange={handleChange}
          err={errors.name}
        />
        <InputField
          name="phone"
          type="number"
          value={formData.phone}
          label="Phone Number:"
          placeholder="08123456789"
          onChange={handleChange}
          err={errors.phone}
        />
      </div>

      <div className="font-semibold">Address</div>
      <label htmlFor="">
        Street:
        <textarea
          name="street"
          className="textarea textarea-bordered w-full"
          placeholder="Input address here.."
          onChange={handleChange}
          rows={3}
        ></textarea>
        <div className="label">
          <span className="label-text-alt text-red-500">{errors.street}</span>
        </div>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full justify-between">
        <label className="form-control w-full max-w-full relative">
          <div className="label">
            <span className={`label-text`}>Province:</span>
          </div>
          <select
            name="province_id"
            id="province_id"
            className="select select-bordered"
            onChange={handleChange}
          >
            <option>Choose province</option>
            {allProvinces.data &&
              allProvinces.data.map((val, i) => {
                return (
                  <option key={`provinces-${i}`} value={val.id}>
                    {val.name}
                  </option>
                );
              })}
          </select>
          <div className="label">
            <span className="label-text-alt text-red-500">
              {errors.province_id}
            </span>
          </div>
        </label>

        <label className="form-control w-full max-w-full relative">
          <div className="label">
            <span className={`label-text`}>City:</span>
          </div>
          <select
            name="city_id"
            id="city_id"
            className="select select-bordered"
            onChange={handleChange}
            disabled={!formData.province_id}
          >
            <option>Choose city</option>
            {allCities.data &&
              allCities.data.cities.map((val, i) => {
                return (
                  <option key={`cities-${i}`} value={val.id}>
                    {val.name}
                  </option>
                );
              })}
          </select>
          <div className="label">
            <span className="label-text-alt text-red-500">
              {errors.city_id}
            </span>
          </div>
        </label>

        <InputField
          name="postal_code"
          type="number"
          value={formData.postal_code}
          label="Postal Code:"
          placeholder="33215"
          onChange={handleChange}
          err={errors.postal_code}
        />

        <InputField
          name="detail"
          type="text"
          value={formData.detail}
          label="Detail:"
          placeholder="pagar hitam"
          onChange={handleChange}
          err={errors.detail}
        />
      </div>

      <div className="mt-4">
        <Map formData={formData} setFormData={setFormData} />
      </div>

      <div className="form-control max-w-fit mt-4">
        <label className="label justify-start gap-4 cursor-pointer">
          <span className="label-text font-semibold">Set as main address</span>
          <input
            type="checkbox"
            name="is_default"
            checked={isMainAddress}
            className="toggle toggle-accent"
            onChange={(e) => setIsMainAddress(e.target.checked)}
          />
        </label>
      </div>

      <div className="flex gap-4 max-w-fit mt-6">
        <Button variants="secondary" onClick={setBack}>
          Back
        </Button>

        <Button type="submit" variants="primary">
          Save
        </Button>
      </div>
    </form>
  );
};

export default FormAddress;
