import AdminHeader from "@/components/Header/AdminHeader";
import AdminLayout from "@/components/Layout/AdminLayout";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { DoctorSpecializations, ProductCategory } from "@/types";
import Head from "next/head";
import React from "react";

const DoctorSpecialization = () => {
  const tableHeads = ["", "Specialization Name"];
  const specializations = useCustomSWR<DoctorSpecializations[]>(
    `${apiBaseUrl}/doctor-specialists`
  );
  return (
    <AdminLayout>
      <Head>
        <title>Doctor Specialization | Super Admin</title>
      </Head>
      <AdminHeader>Doctor Specializations</AdminHeader>
      <div className="overflow-x-auto">
        <table className="table table-lg table-zebra bg-white mt-12">
          <thead>
            <tr>
              {tableHeads.map((head, idx) => (
                <th key={idx} className="text-center">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center">
            {specializations.data &&
              specializations.data.map((specialization) => (
                <tr key={specialization.id}>
                  <td className="w-4">{specialization.id}</td>
                  <td className="text-center">{specialization.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default DoctorSpecialization;
