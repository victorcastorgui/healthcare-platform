import BaseCard from "@/components/Card/BaseCard";
import CopyTextIcon from "@/components/CopyTextIcon/CopyTextIcon";
import CountdownTimer from "@/components/CountdownTimer/CountdownTimer";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { Store } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button/Button";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { PostResponse, TelemedicineDetail } from "@/types";
import { apiBaseUrl } from "@/config";
import { useFetch } from "@/hooks/useFetch";
import { getToken } from "@/utils/token";
import { toast } from "sonner";

const TelemedicinePayment = () => {
  const router = useRouter();
  const teleId = router.query.telemedicineId;
  const [image, setImage] = useState<string | null>(null);
  const [paymentProof, setPaymentProof] = useState<string | File>();
  const token = getToken();
  const telemedicineDetail = useCustomSWR<TelemedicineDetail>(
    `${apiBaseUrl}/telemedicines/${teleId}`
  );
  const {
    data: dataUploadPayment,
    fetchData: uploadPayment,
    error,
    errorMsg,
    isLoading,
  } = useFetch();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].size > 500000) {
      toast.error("Apologies, the maximum allowable image size is 500 kB.");
    } else if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (paymentProof) {
      const data = new FormData();
      data.append("image", paymentProof);

      uploadPayment(
        `${apiBaseUrl}/telemedicines/${router.query.teleId}/payment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );
      return;
    }

    toast.error("You must upload payment proof:)");
  };

  useEffect(() => {
    const res = dataUploadPayment as PostResponse;
    if (res.message === "payment success") {
      toast.success("Add product successfull!");
      return;
    }
    if (error !== null) {
      toast.error(errorMsg);
    }
  }, [dataUploadPayment, error, router, isLoading, errorMsg]);

  return (
    <>
      <Head>
        <title>Consultation Payment | User</title>
      </Head>
      <section className="w-11/12 md:w-4/5 max-w-screen-sm md:max-w-screen-xl mx-auto pt-36 pb-12">
        <h2 className="text-3xl font-bold mt-4">Consultation Payment</h2>
        {telemedicineDetail.data && (
          <div className="grid grid-cols-1 md:grid-cols-3 justify-center items-start gap-8 mt-6">
            <div className="flex flex-col col-span-2 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="col-span-1 sm:col-span-2">
                  <BaseCard>
                    <h3 className="font-semibold text-2xl mb-3">Payment</h3>
                    <div className="mt-2">
                      <Image
                        src="https://everhealth-asset.irfancen.com/bank/bca.webp"
                        alt="logo bca"
                        width={100}
                        height={50}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-lg">
                        Account Number:{" "}
                        <span className="font-semibold select-all">
                          1021868341
                        </span>
                      </div>
                      <CopyTextIcon textToCopy="1021868341" />
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-lg">
                        Total:{" "}
                        <span className="font-semibold select-all">
                          {formatToRupiah(
                            parseInt(telemedicineDetail.data.data.total_payment)
                          )}
                        </span>
                      </div>
                      <CopyTextIcon
                        textToCopy={telemedicineDetail.data.data.total_payment}
                      />
                    </div>
                  </BaseCard>
                </div>

                <BaseCard>
                  <h3 className="font-semibold text-2xl mb-4">Expired At</h3>
                  <CountdownTimer
                    expirationDate={
                      new Date(telemedicineDetail.data.data.expired_at)
                    }
                  />
                </BaseCard>
              </div>

              <BaseCard>
                <h3 className="font-semibold text-2xl mb-4">Upload Payment</h3>
                <div className="flex items-center justify-center w-full gap-5">
                  {image && (
                    <Image
                      src={image}
                      alt="payment proof"
                      width={200}
                      height={180}
                      className="w-[200px] h-[180px]"
                    />
                  )}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 font-semibold dark:text-gray-400">
                          Click to upload
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Only PNG (Max. 500 Kb)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept="image/png"
                        onChange={handleImage}
                      />
                    </label>
                  </div>
                </div>

                <div className="max-w-44 mt-6">
                  <Button variants="secondary" onClick={() => {}}>
                    Upload
                  </Button>
                </div>
              </BaseCard>
            </div>
            <BaseCard>
              <div className="flex gap-2 items-center mb-4">
                <Store size={24} />
                <h3 className="font-semibold text-2xl">Order Summary</h3>
              </div>
              <div className="flex justify-between gap-8 mb-2">
                <p>
                  Consultation with{" "}
                  <span className="font-semibold">
                    {telemedicineDetail.data.data.doctor.name}
                  </span>
                </p>
                <p>
                  {formatToRupiah(
                    parseInt(telemedicineDetail.data.data.total_payment)
                  )}
                </p>
              </div>
              <hr className="h-px mb-2 bg-gray-200 border-0"></hr>
              <div className="flex justify-between mt-2">
                <div className="font-semibold">Total Cost </div>
                <div className="font-bold">
                  {formatToRupiah(
                    parseInt(telemedicineDetail.data.data.total_payment)
                  )}
                </div>
              </div>
            </BaseCard>
          </div>
        )}
      </section>
    </>
  );
};

export default TelemedicinePayment;
