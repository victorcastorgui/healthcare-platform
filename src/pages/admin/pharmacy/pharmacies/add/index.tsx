import BackButton from "@/components/Button/BackButton";
import Button from "@/components/Button/Button";
import BaseCard from "@/components/Card/BaseCard";
import { InputField } from "@/components/Input/InputField";
import PharmacyLayout from "@/components/Layout/PharmacyLayout";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { useFetch } from "@/hooks/useFetch";
import {
  PostResponse,
  Provinces,
  ResponseError,
  TCities,
  TPharmaciesDetailForm,
  ValidAddress,
} from "@/types";
import { parseAndFormatTime } from "@/utils/formatter/parseStringToTime";
import { getToken } from "@/utils/token";
import { validatePharmacies } from "@/utils/validate";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Select, { ActionMeta, MultiValue } from "react-select";
import dynamic from "next/dynamic";

export interface DayOption {
  value: string;
  label: string;
}

export const daysOptions: DayOption[] = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});

const AddPharmacies = () => {
  const [formData, setFormData] = useState<TPharmaciesDetailForm>({
    name: "",
    address: "",
    city_id: 0,
    province_id: 0,
    latitude: "-6.2304177",
    longitude: "106.8236458",
    start_time: "",
    end_time: "",
    operational_day: [],
    pharmacist_license_number: "",
    pharmacist_phone_number: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    address: "",
    city_id: "",
    province_id: "",
    latitude: "",
    longitude: "",
    start_time: "",
    end_time: "",
    operational_day: "",
    pharmacist_license_number: "",
    pharmacist_phone_number: "",
  });

  const allProvinces = useCustomSWR<Provinces[]>(`${apiBaseUrl}/provinces`);
  const allCities = useCustomSWR<TCities>(
    formData.province_id !== 0 && !Number.isNaN(formData.province_id)
      ? `${apiBaseUrl}/provinces/${formData.province_id}`
      : null
  );

  const { data, setData, errorMsg, setErrorMsg, fetchData } = useFetch<
    PostResponse & ResponseError
  >();
  const token = getToken();
  const router = useRouter();

  const [selectedDays, setSelectedDays] = useState<DayOption[]>([]);

  useEffect(() => {
    if (data) {
      toast.success("Add pharmacy success!");
      setData(null);
      router.push("/admin/pharmacy/pharmacies");
    }
    if (errorMsg) {
      toast.error(errorMsg);
      setErrorMsg("");
    }
  }, [data, errorMsg]);

  useEffect(() => {
    if (selectedDays) {
      const ops_days = selectedDays.map((val) => val.value);
      setFormData((formData) => ({ ...formData, operational_day: ops_days }));
    }
  }, [selectedDays]);

  const handleChangeDays = (
    newValue: MultiValue<DayOption>,
    actionMeta: ActionMeta<DayOption>
  ) => {
    if (Array.isArray(newValue)) {
      setSelectedDays(newValue);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const errorMessage = validatePharmacies(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
    let newValue: any;
    switch (name) {
      case "province_id":
        newValue = Number(value);
        break;
      case "city_id":
        newValue = Number(value);
        break;
      case "start_time":
        newValue = parseAndFormatTime(value);
        break;
      case "end_time":
        newValue = parseAndFormatTime(value);
        break;
      default:
        newValue = value;
        break;
    }
    setFormData((formData) => ({ ...formData, [name]: newValue }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    const fieldsToValidate = [
      "name",
      "pharmacist_phone_number",
      "pharmacist_license_number",
      "start_time",
      "end_time",
      "province_id",
      "operational_day",
      "city_id",
      "address",
    ];

    fieldsToValidate.forEach((fieldName) => {
      const value = formData[fieldName as keyof typeof formData];
      const errorMessage = validatePharmacies(fieldName, String(value));

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
        await fetchData(`${apiBaseUrl}/pharmacies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        return;
      } else {
        toast.error("Chosen city and map pin point is mismatch!");
        return;
      }
    }
    toast.error("Please fill all required fields correctly.");
  };

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

  return (
    <PharmacyLayout>
      <Head>
        <title>Add Pharmacies | Pharmacy</title>
      </Head>
      <BackButton route="/admin/pharmacy/pharmacies" />

      <section className="mt-8">
        <BaseCard>
          <h2 className="text-3xl font-bold max-lg:text-center mb-6">
            Add Pharmacies
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 w-full gap-x-4">
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
                name="pharmacist_phone_number"
                type="number"
                value={formData.pharmacist_phone_number}
                label="Phone Number:"
                placeholder="08123456789"
                onChange={handleChange}
                err={errors.pharmacist_phone_number}
              />

              <InputField
                name="pharmacist_license_number"
                type="text"
                value={formData.pharmacist_license_number}
                label="Pharmacist License Number:"
                placeholder="289654739640"
                onChange={handleChange}
                err={errors.pharmacist_license_number}
              />

              <InputField
                label="Start Time:"
                type="time"
                id="start_time"
                name="start_time"
                onChange={handleChange}
                value={formData.start_time}
                err={errors.start_time}
              />

              <InputField
                label="End Time:"
                type="time"
                id="end_time"
                name="end_time"
                onChange={handleChange}
                value={formData.end_time}
                err={errors.end_time}
              />

              <label className="form-control w-full max-w-full relative">
                <div className="label">
                  <span className={`label-text`}>Operational Days:</span>
                </div>
                <Select
                  options={daysOptions}
                  isMulti
                  value={selectedDays}
                  onChange={handleChangeDays}
                />
                <div className="label">
                  <span className="label-text-alt text-red-500">
                    {errors.operational_day}
                  </span>
                </div>
              </label>

              <label className="col-span-3">
                Address:
                <textarea
                  name="address"
                  className="textarea textarea-bordered w-full mt-2"
                  placeholder="Input address here.."
                  onChange={(e) => handleChange(e)}
                  rows={3}
                ></textarea>
                <div className="label">
                  <span className="label-text-alt text-red-500">
                    {errors.address}
                  </span>
                </div>
              </label>

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
                    allCities.data.cities &&
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
            </div>
            <div className="mt-4 col-span-3">
              <Map formData={formData} setFormData={setFormData} />
            </div>

            <div className="max-w-40 mt-6">
              <Button type="submit" variants="primary">
                Submit
              </Button>
            </div>
          </form>
        </BaseCard>
      </section>
    </PharmacyLayout>
  );
};

export default AddPharmacies;
