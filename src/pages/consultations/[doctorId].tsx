import Button from "@/components/Button/Button";
import Spinner from "@/components/Loading/Spinner";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { Doctors, PostTelemedicine, ResponseError } from "@/types";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { useRouter } from "next/router";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { formatToTitleCase } from "@/utils/formatter/formatToTitleCase";
import { ArrowLeft, BriefcaseIcon } from "lucide-react";
import Head from "next/head";
import { capitalizeFirstChar } from "@/utils/formatter/capitalizeFirstChar";
import { getRoleId, getToken } from "@/utils/token";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "sonner";
import UniversalConfModal from "@/components/Modal/UniversalConfModal";

const ConsultationDoctorProfile = () => {
  const router = useRouter();
  const token = getToken();
  const roleId = getRoleId();
  const doctorId = router.query.doctorId;
  const [isModaOpen, setIsModalOpen] = useState<boolean>(false);
  const {
    fetchData: postTelemedicine,
    data: postData,
    error,
    errorMsg,
    isLoading,
  } = useFetch();
  const doctor = useCustomSWR<Doctors & ResponseError>(
    router.query.doctorId
      ? `${apiBaseUrl}/doctors/${router.query.doctorId}`
      : null
  );

  const handleCreateTelemedicine = async () => {
    const url = `${apiBaseUrl}/telemedicines`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ doctor_id: parseInt(doctorId as string) }),
    };
    await postTelemedicine(url, options);
  };

  useEffect(() => {
    const res = postData as PostTelemedicine;
    if (
      res.message === "created success" &&
      parseInt(doctorId as string) !== 0
    ) {
      toast.success("Success");
      if (!isLoading) {
        router.push(`/user/consultation/${res.data.id}/payment`);
      }
      return;
    }
    if (error !== null && parseInt(doctorId as string) !== 0) {
      toast.error(errorMsg);
    }
  }, [postData, error, router, isLoading, doctorId, errorMsg]);

  return (
    <>
      {isModaOpen && (
        <UniversalConfModal
          isOpen={isModaOpen}
          setIsOpen={setIsModalOpen}
          message="Are you sure you want to start the consultation?"
          handleOnConfirm={handleCreateTelemedicine}
        />
      )}
      <Head>
        <title>Consultation Doctor Profile</title>
      </Head>
      <div className="max-w-screen-sm md:max-w-screen-md px-4 md:mx-auto h-full flex md:items-start flex-col md:flex-row justify-center items-center gap-6 pt-32 pb-12">
        {doctor.error && (
          <div>Error getting the data, please refresh the page</div>
        )}
        {doctor.isLoading && <Spinner />}
        {doctorId && doctor.data && (
          <>
            <div className="max-w-sm p-6 mx-auto bg-white border w-full border-gray-200 rounded-2xl shadow flex justify-center">
              <div className="relative w-[200px] h-[200px] m-auto">
                <Image
                  src={doctor.data.image}
                  alt={doctor.data.name}
                  fill
                  sizes="100%"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col gap-10 max-w-sm md:max-w-lg w-full px-10 py-6 col-span-2 bg-white border border-gray-200 rounded-2xl shadow">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between gap-4">
                  <div className="w-full">
                    <h2 className=" text-3xl font-semibold text-[#00383F] mb-2">
                      {doctor.data.name}
                    </h2>
                  </div>
                  <div className="w-2/5 bg-primary rounded-full text-white font-medium px-2 py-1 flex items-center justify-center gap-1 h-fit">
                    <BriefcaseIcon height={18} width={18} />
                    <p>{`${doctor.data.yoe} ${
                      doctor.data.yoe > 1 ? "years" : "year"
                    }`}</p>
                  </div>
                </div>
                <p className="text-gray-400">
                  {formatToTitleCase(doctor.data.specialization)}
                </p>
                <div className="flex flex-col lg:flex-row gap-2 justify-between items-center">
                  <p className="text-xl font-semibold text-[#36A5B2]">
                    {formatToRupiah(parseInt(doctor.data.fee))}
                  </p>
                  {doctor.data.status.toLowerCase() === "online" && (
                    <p className="text-green-600">
                      {capitalizeFirstChar(doctor.data.status)}
                    </p>
                  )}
                  {doctor.data.status.toLowerCase() === "offline" && (
                    <p className="text-red-500">
                      {capitalizeFirstChar(doctor.data.status)}
                    </p>
                  )}
                  {doctor.data.status.toLowerCase() === "busy" && (
                    <p className="text-gray-500">
                      {capitalizeFirstChar(doctor.data.status)}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full border-b border-solid pb-6">
                <Button
                  variants="primary"
                  onClick={() => {
                    if (token !== undefined && roleId !== undefined) {
                      setIsModalOpen(true);
                      return;
                    }
                    toast.warning("Please, login with your account.");
                    router.replace("/auth/login");
                  }}
                >
                  Start Consultation
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-lg">
                  Doctor&apos;s Certificate
                </h3>
                <div className="w-full">
                  <iframe
                    src={`${doctor.data.certificate}#toolbar=0`}
                    className="w-[300px] h-[200px] md:w-[400px] md:h-[300px]"
                  />
                </div>
              </div>
              <div
                className="flex gap-2 mt-10 cursor-pointer"
                onClick={() => router.back()}
              >
                <ArrowLeft color="#B2B8C1" />
                <p className="text-gray-400">Back to consultations page</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ConsultationDoctorProfile;
