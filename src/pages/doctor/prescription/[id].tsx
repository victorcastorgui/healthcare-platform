import Button from "@/components/Button/Button";
import BaseCard from "@/components/Card/BaseCard";
import { InputField } from "@/components/Input/InputField";
import { apiBaseUrl } from "@/config";
import { useFetch } from "@/hooks/useFetch";
import { getToken } from "@/utils/token";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Prescription = () => {
  const router = useRouter();
  const token = getToken();

  const [prescription, setPrescription] = useState<string>("");
  const [errorPrescription, setErrorPrescription] = useState("");

  const { data, setData, setErrorMsg, errorMsg, fetchData } = useFetch();

  useEffect(() => {
    if (data) {
      toast.success("Create prescription success!");
      setData(null);
      setPrescription("");
      router.push("/doctor");
    }

    if (errorMsg) {
      toast.error(errorMsg);
      setErrorMsg("");
    }
  }, [data, errorMsg]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    setPrescription(value);

    setErrorPrescription(
      prescription.trim().length > 8
        ? ""
        : "Input must be at least 8 characters"
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = prescription.trim().length > 8;

    if (isFormValid) {
      setErrorPrescription("");

      await fetchData(
        `${apiBaseUrl}/telemedicines/${router.query.id}/prescription`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prescription }),
        }
      );
      return;
    }
    setErrorPrescription("Input must be at least 8 characters");
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
              Form Prescription
            </div>
            <div className="flex flex-col w-72 md:w-96 gap-8">
              <form onSubmit={handleSubmit}>
                <label htmlFor="">
                  Prescription:
                  <textarea
                    name="prescription"
                    className="textarea textarea-bordered w-full"
                    placeholder="Input prescription here.."
                    onChange={handleChange}
                    rows={5}
                  ></textarea>
                  <div className="label">
                    <span className="label-text-alt text-red-500">
                      {errorPrescription}
                    </span>
                  </div>
                </label>

                <div className="mt-4">
                  <Button type="submit" variants="primary">
                    Create Prescription
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

export default Prescription;
