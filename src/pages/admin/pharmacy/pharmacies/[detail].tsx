import BackButton from "@/components/Button/BackButton";
import BaseCard from "@/components/Card/BaseCard";
import PharmacyLayout from "@/components/Layout/PharmacyLayout";
import Spinner from "@/components/Loading/Spinner";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { TPharmacies, TPharmaciesData } from "@/types";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

const PharmacyDetail = () => {
  const router = useRouter();

  const pharmacy = useCustomSWR<TPharmacies<TPharmaciesData>>(
    `${apiBaseUrl}/pharmacies/${router.query.detail}`
  );

  return (
    <PharmacyLayout>
      <Head>
        <title>Detail Pharmacies | Pharmacy</title>
      </Head>
      <BackButton route="/admin/pharmacy/pharmacies" />

      <section className="max-w-fit mt-8">
        <BaseCard>
          <h2 className="text-3xl font-bold max-lg:text-center">
            Pharmacies Detail
          </h2>
          {pharmacy.error && (
            <div>Error getting the data, please refresh the page</div>
          )}
          {pharmacy.isLoading && <Spinner />}
          {pharmacy.data && pharmacy.data.data && (
            <>
              <div className="relative w-fit overflow-x-auto border border-gray-200 shadow-md sm:rounded-lg mt-6">
                <table className="w-fit text-left">
                  <tbody className="text-lg">
                    <tr className="odd:bg-white even:bg-slate-200">
                      <th className="px-6 py-3">Pharmacy Name</th>
                      <td className="px-6 py-3">{pharmacy.data.data.name}</td>
                    </tr>
                    <tr className="odd:bg-white even:bg-slate-200">
                      <th className="px-6 py-3">Phone Number</th>
                      <td className="px-6 py-3">
                        {pharmacy.data.data.pharmacist_phone_number}
                      </td>
                    </tr>
                    <tr className="odd:bg-white even:bg-slate-200">
                      <th className="px-6 py-3">License Number</th>
                      <td className="px-6 py-3">
                        {pharmacy.data.data.pharmacist_license_number}
                      </td>
                    </tr>
                    <tr className="odd:bg-white even:bg-slate-200">
                      <th className="px-6 py-3">Operational Time</th>
                      <td className="px-6 py-3">
                        {pharmacy.data.data.start_time} -{" "}
                        {pharmacy.data.data.end_time}
                      </td>
                    </tr>
                    <tr className="odd:bg-white even:bg-slate-200">
                      <th className="px-6 py-3">Operational Days</th>
                      <td className="px-6 py-3">
                        {pharmacy.data.data.operational_day.join(", ")}
                      </td>
                    </tr>
                    <tr className="odd:bg-white even:bg-slate-200">
                      <th className="px-6 py-3">Address</th>
                      <td className="px-6 py-3">
                        {pharmacy.data.data.address},{" "}
                        {pharmacy.data.data.city.name},{" "}
                        {pharmacy.data.data.province.name}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </BaseCard>
      </section>
    </PharmacyLayout>
  );
};

export default PharmacyDetail;
