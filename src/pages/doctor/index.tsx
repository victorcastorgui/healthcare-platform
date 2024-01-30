import Button from "@/components/Button/Button";
import BaseCard from "@/components/Card/BaseCard";
import OrderStatus from "@/components/Label/OrderStatus";
import { formatToTitleCase } from "@/utils/formatter/formatToTitleCase";
import moment from "moment";
import Head from "next/head";
import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import Toggle from "@/components/Input/Toggle";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { apiBaseUrl } from "@/config";
import { Doctors, PostResponse, Telemedicine } from "@/types";
import { useRouter } from "next/router";
import Link from "next/link";
import { FileSpreadsheet, FileText } from "lucide-react";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { InputField } from "@/components/Input/InputField";
import Pagination from "@/components/Pagination/Pagination";
import { capitalizeFirstChar } from "@/utils/formatter/capitalizeFirstChar";
import { getToken } from "@/utils/token";
import { useFetch } from "@/hooks/useFetch";
import UniversalConfModal from "@/components/Modal/UniversalConfModal";
import { toast } from "sonner";

type TStatus = {
  online: boolean;
  offline: boolean;
};

const DoctorTelemedicine = () => {
  const limit = 6;
  const router = useRouter();
  const token = getToken();
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const debounceSearchInput = useDebounce<string>(searchInput);
  const [isModaOpen, setIsModalOpen] = useState<boolean>(false);
  const [toggleStatus, setToggleStatus] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const { fetchData: putStatus } = useFetch();
  const { fetchData: putEndChat, data, error, errorMsg, setData } = useFetch();
  const [teleId, setTeleId] = useState<number>(0);
  const { push } = useRouter();

  const consultHistory = useCustomSWR<Telemedicine>(
    `${apiBaseUrl}/telemedicines?name=${debounceSearchInput}&page=${page}&limit=${limit}`
  );
  const doctor = useCustomSWR<Doctors>(
    token !== undefined ? `${apiBaseUrl}/users/profile` : null
  );

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleChangeStatus = async () => {
    const url = `${apiBaseUrl}/users/status`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: status.toLowerCase() }),
    };
    await putStatus(url, options);
  };

  useEffect(() => {
    if (doctor.data !== undefined) {
      let boolStatus = false;
      if (doctor.data.status === "online") {
        boolStatus = true;
      }
      setToggleStatus(boolStatus);
      setStatus(doctor.data.status);
    }
  }, [doctor.data]);

  useEffect(() => {
    const objStatus: TStatus = {
      online: true,
      offline: false,
    };
    if (
      doctor.data !== undefined &&
      toggleStatus !== objStatus[doctor.data.status as keyof TStatus]
    ) {
      handleChangeStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleStatus]);

  useEffect(() => {
    const handleEndChat = async () => {
      const url = `${apiBaseUrl}/telemedicines/${teleId}/end`;
      const options = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await putEndChat(url, options);
    };
    if (teleId !== 0 && token !== undefined && isModaOpen === false) {
      handleEndChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teleId, token, isModaOpen]);

  useEffect(() => {
    const res = data as PostResponse;
    if (res.message === "ended telemedicine successfully") {
      toast.success("Successfully end chat!");
      setData("");
      consultHistory.mutate();
      return;
    }
    if (error !== null) {
      toast.error(errorMsg);
    }
  }, [data, error, errorMsg, setData, consultHistory]);

  return (
    <>
      {isModaOpen && (
        <UniversalConfModal
          isOpen={isModaOpen}
          setIsOpen={setIsModalOpen}
          message="Are you sure you want to end the chat?"
        />
      )}

      <div className="bg-[url('https://everhealth-asset.irfancen.com/assets/background.png')] bg-cover min-h-screen">
        <Head>
          <title>Telemedicine List | Doctor</title>
        </Head>
        <div className="py-24 w-11/12 lg:w-4/5 m-auto max-w-screen-xl">
          <div className="flex flex-col-reverse sm:flex-row justify-between mt-16 lg:items-center gap-6">
            <h1 className="text-primary-text font-semibold text-3xl">
              Telemedicine List
            </h1>
            {doctor.data && (
              <div className="bg-white p-4 rounded-full w-fit">
                <Toggle
                  label={capitalizeFirstChar(status)}
                  name="status"
                  onChange={() => {
                    setToggleStatus(!toggleStatus);
                    if (!toggleStatus) {
                      setStatus("Online");
                      return;
                    }
                    setStatus("Offline");
                  }}
                  checked={toggleStatus}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row w-full justify-between sm:items-center mt-2">
            <div>
              <InputField
                type="text"
                variants="small"
                name="name"
                placeholder="Search by patient name"
                value={searchInput}
                onChange={handleSearchInput}
              />
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mt-4">
            {consultHistory.error && (
              <div>Error when fetching the data, please refresh the page.</div>
            )}
            {consultHistory.data &&
              consultHistory.data.data.map((consult, idx) => (
                <div key={idx}>
                  <BaseCard>
                    <div className="flex flex-col sm:flex-row w-full items-center gap-6">
                      <div className="flex flex-col gap-1 justify-center items-center">
                        <Image
                          src={consult.profile.image}
                          width={150}
                          height={150}
                          alt={`${consult.profile.name} profile picture`}
                          className="w-56 h-auto border border-solid rounded-xl"
                        />
                      </div>
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-2">
                            <OrderStatus status={consult.status} />
                          </div>
                          <div className="flex flex-col xl:flex-row gap-1">
                            <p className="font-semibold">Consultation Date:</p>
                            <p>
                              {moment(consult.ordered_at).format(
                                "DD-MM-YYYY hh:mm A"
                              )}
                            </p>
                          </div>
                          <div className="flex flex-col xl:flex-row gap-1">
                            <p className="font-semibold">Patient Name:</p>
                            <p>{formatToTitleCase(consult.profile.name)}</p>
                          </div>
                          <div className="flex flex-col xl:flex-row justify-between mt-2">
                            <p>Total Price</p>
                            <p className="text-2xl font-semibold">
                              {formatToRupiah(parseInt(consult.total_payment))}
                            </p>
                          </div>
                          <div className="flex flex-col xl:flex-row w-full justify-between gap-4 mt-4">
                            {consult.status === "canceled" && (
                              <div className="flex w-full gap-4">
                                <div className="flex flex-col gap-1 items-center">
                                  <p className="text-xs font-medium text-white">
                                    Sick leave:
                                  </p>
                                  <Link
                                    href={""}
                                    aria-disabled={true}
                                    tabIndex={-1}
                                    className="pointer-events-none"
                                  >
                                    <FileText size={30} color="#FFFFFF" />
                                  </Link>
                                </div>
                              </div>
                            )}
                            {consult.status !== "waiting for payment" &&
                              consult.status !== "canceled" && (
                                <div className="flex w-full gap-4">
                                  <div className="flex flex-col gap-1 items-center">
                                    <p className="text-xs font-medium">
                                      Sick leave:
                                    </p>
                                    <Link
                                      href={
                                        consult.sick_leave_pdf !== ""
                                          ? consult.sick_leave_pdf
                                          : `/doctor/sick-leave/${consult.id}`
                                      }
                                      target={
                                        consult.sick_leave_pdf !== ""
                                          ? "_blank"
                                          : ""
                                      }
                                      aria-disabled={
                                        consult.sick_leave_pdf === "" &&
                                        consult.status !== "ongoing"
                                          ? true
                                          : false
                                      }
                                      tabIndex={
                                        consult.sick_leave_pdf === "" &&
                                        consult.status !== "ongoing"
                                          ? -1
                                          : undefined
                                      }
                                      className={`tooltip
                                        ${
                                          consult.sick_leave_pdf === "" &&
                                          consult.status !== "ongoing"
                                            ? "pointer-events-none"
                                            : ""
                                        }`}
                                      data-tip={
                                        consult.sick_leave_pdf === "" &&
                                        consult.status === "ongoing"
                                          ? "Fill sick leave form"
                                          : consult.sick_leave_pdf !== ""
                                          ? "Sick leave PDF"
                                          : ""
                                      }
                                    >
                                      <FileText
                                        size={30}
                                        color={
                                          consult.sick_leave_pdf !== ""
                                            ? "#FF6961"
                                            : consult.status === "ongoing"
                                            ? "#000000"
                                            : "#D3D3D3"
                                        }
                                      />
                                    </Link>
                                  </div>
                                  <div className="flex flex-col gap-1 items-center">
                                    <p className="text-xs font-medium">
                                      Prescription:
                                    </p>
                                    <Link
                                      href={
                                        consult.prescription_pdf !== ""
                                          ? consult.prescription_pdf
                                          : `/doctor/prescription/${consult.id}`
                                      }
                                      target={
                                        consult.prescription_pdf !== ""
                                          ? "_blank"
                                          : ""
                                      }
                                      aria-disabled={
                                        consult.prescription_pdf === "" &&
                                        consult.status !== "ongoing"
                                          ? true
                                          : false
                                      }
                                      tabIndex={
                                        consult.prescription_pdf === "" &&
                                        consult.status !== "ongoing"
                                          ? -1
                                          : undefined
                                      }
                                      className={`tooltip
                                        ${
                                          consult.prescription_pdf === "" &&
                                          consult.status !== "ongoing"
                                            ? "pointer-events-none"
                                            : ""
                                        }`}
                                      data-tip={
                                        consult.prescription_pdf === "" &&
                                        consult.status === "ongoing"
                                          ? "Fill prescription form"
                                          : consult.prescription_pdf !== ""
                                          ? "Prescription PDF"
                                          : null
                                      }
                                    >
                                      <FileSpreadsheet
                                        size={30}
                                        color={
                                          consult.prescription_pdf !== ""
                                            ? "#77DD77"
                                            : consult.status === "ongoing"
                                            ? "#000000"
                                            : "#D3D3D3"
                                        }
                                      />
                                    </Link>
                                  </div>
                                </div>
                              )}
                            <div className="flex w-full gap-2 items-end xl:justify-end">
                              {consult.status !== "canceled" ? (
                                consult.status !== "waiting for payment" ? (
                                  <div>
                                    <Button
                                      variants="secondary"
                                      onClick={() => {
                                        push("/doctor/chat");
                                      }}
                                    >
                                      Open chat
                                    </Button>
                                  </div>
                                ) : (
                                  <div>
                                    <Button
                                      variants="secondary"
                                      onClick={() =>
                                        router.push(
                                          `/user/consultation/${consult.id}/payment`
                                        )
                                      }
                                    >
                                      Go to payment
                                    </Button>
                                  </div>
                                )
                              ) : (
                                <Button className="btn btn-ghost opacity-0 cursor-default">
                                  Empty
                                </Button>
                              )}

                              {consult.status.toLowerCase() === "ongoing" && (
                                <div>
                                  <Button
                                    variants="danger"
                                    onClick={() => {
                                      setTeleId(consult.id);
                                      setIsModalOpen(true);
                                    }}
                                  >
                                    End Chat
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </BaseCard>
                </div>
              ))}
          </div>
          {consultHistory.data && (
            <div className="flex justify-center mt-28">
              <Pagination
                totalPage={consultHistory.data.total_page}
                activePage={consultHistory.data.current_page}
                setPage={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorTelemedicine;
