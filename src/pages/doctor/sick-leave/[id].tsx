import Button from "@/components/Button/Button";
import BaseCard from "@/components/Card/BaseCard";
import { InputField } from "@/components/Input/InputField";
import { apiBaseUrl } from "@/config";
import { useFetch } from "@/hooks/useFetch";
import { getToken } from "@/utils/token";
import { validateSickLeave } from "@/utils/validate";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type TSickLeave = {
  start_date: string;
  end_date: string;
  diagnosa: string;
};

const SickLeave = () => {
  const router = useRouter();
  const token = getToken();

  const [formData, setFormData] = useState<TSickLeave>({
    start_date: "",
    end_date: "",
    diagnosa: "",
  });
  const [errors, setErrors] = useState({
    start_date: "",
    end_date: "",
    diagnosa: "",
  });

  const { data, setData, setErrorMsg, errorMsg, fetchData } = useFetch();

  useEffect(() => {
    if (data) {
      toast.success("Create sick leave success!");
      setData(null);
      router.push("/doctor");
    }

    if (errorMsg) {
      toast.error(errorMsg);
      setErrorMsg("");
    }
  }, [data, errorMsg]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errorMessage = validateSickLeave(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    const fieldsToValidate = ["start_date", "end_date", "diagnosa"];

    fieldsToValidate.forEach((fieldName) => {
      const value = formData[fieldName as keyof typeof formData];
      const errorMessage = validateSickLeave(fieldName, String(value));

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
      await fetchData(
        `${apiBaseUrl}/telemedicines/${router.query.id}/sick-leave`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      return;
    }
    toast.error("Please fill all required fields correctly.");
  };

  return (
    <div className="bg-[url('https://everhealth-asset.irfancen.com/assets/background.png')] bg-cover min-h-screen">
      <Head>
        <title>Sick Leave | Doctor</title>
      </Head>

      <div className="py-24 w-11/12 lg:w-2/5 m-auto max-w-screen-xl">
        <div className="w-24 self-start mb-8">
          <Button
            variants="secondary"
            onClick={() => {
              router.push("/doctor");
            }}
          >
            Back
          </Button>
        </div>

        <BaseCard>
          <div className="flex flex-col gap-3 items-center justify-center pb-6">
            <div className="font-bold text-primary text-3xl mb-4">
              Form Sick Leave
            </div>
            <div className="flex flex-col w-72 md:w-96 gap-8">
              <form onSubmit={handleSubmit}>
                <InputField
                  label="Start Date:"
                  name="start_date"
                  type="date"
                  onChange={handleChange}
                  value={formData.start_date}
                  err={errors.start_date}
                />
                <InputField
                  label="End Date:"
                  name="end_date"
                  type="date"
                  onChange={handleChange}
                  value={formData.end_date}
                  err={errors.end_date}
                />
                <InputField
                  label="Diagnosa:"
                  name="diagnosa"
                  type="text"
                  onChange={handleChange}
                  value={formData.diagnosa}
                  err={errors.diagnosa}
                />
                <div className="mt-4">
                  <Button type="submit" variants="primary">
                    Create Sick Leave
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
};

export default SickLeave;
