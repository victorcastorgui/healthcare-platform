import Button from "@/components/Button/Button";
import BaseCard from "@/components/Card/BaseCard";
import { InputField } from "@/components/Input/InputField";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { DoctorList, PostTelemedicine } from "@/types";
import Spinner from "@/components/Loading/Spinner";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import { formatToTitleCase } from "@/utils/formatter/formatToTitleCase";
import Pagination from "@/components/Pagination/Pagination";
import SortOrder from "@/components/Sort/SortOrder";
import { orderBy } from "@/lib/orderBy";
import { BriefcaseIcon } from "lucide-react";
import { capitalizeFirstChar } from "@/utils/formatter/capitalizeFirstChar";
import Head from "next/head";
import { useRouter } from "next/router";
import { arrSpecialization, objSpecialization } from "@/lib/filterBy";
import { useFilter } from "@/hooks/useFilter";
import { limit } from "@/lib/dataLimit";
import { useFetch } from "@/hooks/useFetch";
import { apiBaseUrl } from "@/config";
import { getRoleId, getToken } from "@/utils/token";
import { toast } from "sonner";
import UniversalConfModal from "@/components/Modal/UniversalConfModal";

const Consultations = () => {
  const router = useRouter();
  const sortBy = ["Name", "Fee"];
  const defaultSortTitle = "Name";
  const defaultFilterTitle = "specialization";
  const searchParam = "name";
  const token = getToken();
  const roleId = getRoleId();
  const [doctorId, setDoctorId] = useState<number>(0);
  const {
    fetchData: postTelemedicine,
    data: postData,
    error,
    errorMsg,
    isLoading,
  } = useFetch();
  const [isModaOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    swrResponse: doctors,
    searchInput,
    sortTitle,
    setSortTitle,
    orderTitle,
    setOrderTitle,
    setPage,
    filterTitle,
    setFilterTitle,
    handleSearchInput,
  } = useFilter<DoctorList>(
    "doctors",
    searchParam,
    defaultSortTitle,
    limit,
    defaultFilterTitle,
    objSpecialization
  );

  const handleCreateTelemedicine = async () => {
    const url = `${apiBaseUrl}/telemedicines`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ doctor_id: doctorId }),
    };
    await postTelemedicine(url, options);
  };
  useEffect(() => {
    const res = postData as PostTelemedicine;
    if (res.message === "created success" && doctorId !== 0) {
      toast.success("Success");
      if (!isLoading) {
        router.push(`/user/consultation/${res.data.id}/payment`);
      }
      return;
    }
    if (error !== null && doctorId !== 0) {
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
        <title>Consultations | Doctor List</title>
      </Head>
      <div className="py-24 w-11/12 lg:w-4/5 m-auto max-w-screen-xl">
        <h1 className="text-center mt-16 text-primary-text font-semibold text-3xl">
          Consultations
        </h1>
        <div className="flex flex-col sm:flex-row w-full justify-between sm:items-center mt-10">
          <div className="flex items-center text-sm gap-4 ">
            <SortOrder
              sortBy={sortBy}
              orderBy={orderBy}
              sortTitle={sortTitle}
              setSortTitle={setSortTitle}
              orderTitle={orderTitle}
              setOrderTitle={setOrderTitle}
              filterSectionTitle="Specialization"
              filterBy={arrSpecialization}
              filterTitle={filterTitle}
              setFilterTitle={setFilterTitle}
            />
          </div>
          <div>
            <InputField
              type="text"
              variants="small"
              name="name"
              placeholder="Search by name"
              value={searchInput}
              onChange={handleSearchInput}
            />
          </div>
        </div>
        {doctors.error && (
          <div>Error getting the data, please refresh the page</div>
        )}
        {doctors.isLoading && <Spinner />}
        {doctors.data && (
          <>
            {doctors.data.data === null ? (
              <div className="mt-8">
                <BaseCard>
                  <div className="flex flex-col font-semibold text-xl justify-center items-center">
                    <Image
                      src="https://everhealth-asset.irfancen.com/assets/no-doctor.webp"
                      alt="no doctor"
                      width={350}
                      height={350}
                    />
                    There is no doctor.
                  </div>
                </BaseCard>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-4">
                {doctors.data.data.map((doctor, idx) => (
                  <div key={idx}>
                    <BaseCard>
                      <div className="flex flex-col gap-8">
                        <div
                          className="flex flex-col gap-4 cursor-pointer"
                          onClick={() =>
                            router.push(`/consultations/${doctor.id}`)
                          }
                        >
                          <div className="relative w-[200px] h-[200px] m-auto">
                            <Image
                              src={doctor.image}
                              fill
                              sizes="100%"
                              className="object-cover"
                              alt="Doctor profile picture"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between min-h-14 items-center">
                              <div className="w-3/5">
                                <h3 className="font-semibold text-xl">
                                  {formatToTitleCase(doctor.name)}
                                </h3>
                              </div>
                              <div className="w-2/5 bg-primary rounded-full text-white font-medium px-2 py-1 text-xs flex items-center justify-center gap-1 h-fit">
                                <BriefcaseIcon height={18} width={18} />
                                <p>{`${doctor.yoe} ${
                                  parseInt(doctor.yoe) > 1 ? "years" : "year"
                                }`}</p>
                              </div>
                            </div>
                            <p>{formatToTitleCase(doctor.specialization)}</p>
                            <div className="flex justify-between">
                              <p className="text-primary-text">
                                {formatToRupiah(parseInt(doctor.fee))}
                              </p>
                              {doctor.status.toLowerCase() === "online" && (
                                <p className="text-green-600">
                                  {capitalizeFirstChar(doctor.status)}
                                </p>
                              )}
                              {doctor.status.toLowerCase() === "offline" && (
                                <p className="text-red-500">
                                  {capitalizeFirstChar(doctor.status)}
                                </p>
                              )}
                              {doctor.status.toLowerCase() === "busy" && (
                                <p className="text-gray-500">
                                  {capitalizeFirstChar(doctor.status)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button
                            variants="primary"
                            disabled={doctor.status === "online" ? false : true}
                            onClick={() => {
                              if (token !== undefined && roleId !== undefined) {
                                setDoctorId(doctor.id);
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
                      </div>
                    </BaseCard>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {doctors.data && doctors.data.data !== null && (
          <div className="flex justify-center mt-28">
            <Pagination
              totalPage={doctors.data.total_page}
              activePage={doctors.data.current_page}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Consultations;
