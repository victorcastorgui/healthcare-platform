import BaseCard from "@/components/Card/BaseCard";
import OrderStatus from "@/components/Label/OrderStatus";
import Spinner from "@/components/Loading/Spinner";
import moment from "moment";
import Head from "next/head";
import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { InputField } from "@/components/Input/InputField";
import { formatToTitleCase } from "@/utils/formatter/formatToTitleCase";
import Button from "@/components/Button/Button";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { PostResponse, Telemedicine } from "@/types";
import { apiBaseUrl } from "@/config";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "@/components/Pagination/Pagination";
import { FileSpreadsheet, FileText } from "lucide-react";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { getToken } from "@/utils/token";
import { toast } from "sonner";
import UniversalConfModal from "@/components/Modal/UniversalConfModal";
import { useRouter } from "next/router";

const ConsultationHistory = () => {
  const limit = 6;
  const router = useRouter();
  const [searchInput, setSearchInput] = useState<string>("");
  const debounceSearchInput = useDebounce<string>(searchInput);
  const [page, setPage] = useState<number>(1);
  const [teleId, setTeleId] = useState<number>(0);
  const [isModaOpen, setIsModalOpen] = useState<boolean>(false);
  const token = getToken();
  const { fetchData: putEndChat, data, error, errorMsg, setData } = useFetch();

  const consultHistory = useCustomSWR<Telemedicine>(
    `${apiBaseUrl}/telemedicines?name=${debounceSearchInput}&page=${page}&limit=${limit}`
  );

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

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
      <Head>
        <title>Consultation History | User</title>
      </Head>
      <div className="py-24 w-11/12 lg:w-4/5 m-auto max-w-screen-xl">
        <h1 className="mt-16 text-primary-text font-semibold text-3xl">
          Consultation History
        </h1>
        <div className="flex flex-col sm:flex-row w-full justify-between sm:items-center mt-6">
          <div>
            <InputField
              type="text"
              variants="small"
              name="name"
              placeholder="Search by doctor name"
              value={searchInput}
              onChange={handleSearchInput}
            />
          </div>
        </div>

        {consultHistory.error && (
          <div>Error when fetching the data, please refresh the page.</div>
        )}
        {consultHistory.isLoading && <Spinner />}
        {consultHistory.data && consultHistory.data.data.length === 0 && (
          <div className="mt-8">
            <BaseCard>
              <div className="flex flex-col font-semibold text-xl justify-center items-center">
                <Image
                  src="https://everhealth-asset.irfancen.com/assets/no-doctor.webp"
                  alt="no doctor"
                  width={350}
                  height={350}
                />
                There is no consultation history.
              </div>
            </BaseCard>
          </div>
        )}
        <div className="grid lg:grid-cols-2 gap-8 mt-4">
          {consultHistory.data &&
            consultHistory.data.data.map((consult, idx) => (
              <div key={idx}>
                <BaseCard>
                  <div className="flex flex-col sm:flex-row w-full items-center gap-6">
                    <div className="flex flex-col gap-1 justify-center items-center">
                      <Image
                        src={consult.doctor.image}
                        width={150}
                        height={150}
                        alt="Doctor Profile Picture"
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
                          <p className="font-semibold">Doctor Name:</p>
                          <p>{formatToTitleCase(consult.doctor.name)}</p>
                        </div>
                      </div>

                      <div className="flex flex-col xl:flex-row justify-between">
                        <p>Total Price</p>
                        <p className="text-2xl font-semibold">
                          {formatToRupiah(parseInt(consult.total_payment))}
                        </p>
                      </div>
                      <div className="flex flex-col xl:flex-row w-full justify-between gap-4">
                        <div className="flex w-full gap-4">
                          {consult.status !== "waiting for payment" && (
                            <>
                              <div className="flex flex-col gap-1 items-center">
                                <p className="text-xs font-medium">
                                  Sick leave:
                                </p>
                                <Link
                                  href={consult.sick_leave_pdf}
                                  target="_blank"
                                  aria-disabled={
                                    consult.sick_leave_pdf === "" ? true : false
                                  }
                                  tabIndex={
                                    consult.sick_leave_pdf === ""
                                      ? -1
                                      : undefined
                                  }
                                  className={
                                    consult.sick_leave_pdf === ""
                                      ? "pointer-events-none"
                                      : ""
                                  }
                                >
                                  <FileText
                                    size={30}
                                    color={
                                      consult.sick_leave_pdf === ""
                                        ? "#D3D3D3"
                                        : "#FF6961"
                                    }
                                  />
                                </Link>
                              </div>
                              <div className="flex flex-col gap-1 items-center">
                                <p className="text-xs font-medium">
                                  Prescription:
                                </p>
                                <Link
                                  href={consult.prescription_pdf}
                                  target="_blank"
                                  aria-disabled={
                                    consult.prescription_pdf === ""
                                      ? true
                                      : false
                                  }
                                  tabIndex={
                                    consult.prescription_pdf === ""
                                      ? -1
                                      : undefined
                                  }
                                  className={
                                    consult.prescription_pdf === ""
                                      ? "pointer-events-none"
                                      : ""
                                  }
                                >
                                  <FileSpreadsheet
                                    size={30}
                                    color={
                                      consult.prescription_pdf === ""
                                        ? "#D3D3D3"
                                        : "#77DD77"
                                    }
                                  />
                                </Link>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex w-full gap-2 items-end xl:justify-end">
                          {consult.status !== "waiting for payment" ? (
                            <div>
                              <Button
                                variants="secondary"
                                onClick={() => {
                                  router.push("/user/chat");
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
                          )}

                          {consult.status.toLowerCase() === "ongoing" && (
                            <div>
                              <Button
                                variants="danger"
                                onClick={() => {
                                  setIsModalOpen(true);
                                  setTeleId(consult.id);
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
                </BaseCard>
              </div>
            ))}
        </div>
        {consultHistory.data && consultHistory.data.data.length !== 0 && (
          <div className="flex justify-center mt-28">
            <Pagination
              totalPage={consultHistory.data.total_page}
              activePage={consultHistory.data.current_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultationHistory;
