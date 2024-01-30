import { useCustomSWR } from "@/hooks/useCustomSWR";
import { apiBaseUrl } from "@/config";
import React from "react";
import { TDoctor } from "@/types";
import Image from "next/image";
import Head from "next/head";
import BaseCard from "@/components/Card/BaseCard";
import { formatToRupiah } from "@/utils/formatter/formatToRupiah";
import Button from "@/components/Button/Button";
import { useRouter } from "next/router";

const DoctorProfile = () => {
  const doctor = useCustomSWR<TDoctor>(`${apiBaseUrl}/users/profile`);
  const router = useRouter();

  return (
    <div className="bg-[url('https://everhealth-asset.irfancen.com/assets/background.png')] bg-cover min-h-screen">
      <Head>
        <title>Doctor Profile</title>
      </Head>
      <section className="max-w-screen-xl w-11/12 lg:w-3/5 mx-auto pt-24 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {doctor.data && (
            <>
              <div>
                <BaseCard customStyle="flex justify-center items-center">
                  <Image
                    src={
                      doctor.data.image === ""
                        ? `https://everhealth-asset.irfancen.com/assets/avatar-placeholder.png`
                        : doctor.data.image
                    }
                    alt={doctor.data.name}
                    width={200}
                    height={200}
                    className="rounded-full border-2 object-cover w-[150px] h-[150px] md:w-[200px] md:h-[200px]"
                    priority
                  />
                </BaseCard>

                <div className="flex justify-center items-center gap-4 mt-6">
                  <div className="max-w-fit">
                    <Button
                      variants="primary"
                      onClick={() => router.push("/doctor/profile/edit")}
                    >
                      Edit Profile
                    </Button>
                  </div>
                  <div className="max-w-fit">
                    <Button
                      variants="primary"
                      onClick={() =>
                        router.push("/doctor/profile/reset-password")
                      }
                    >
                      Reset Password
                    </Button>
                  </div>
                </div>
              </div>

              <BaseCard customStyle="col-span-1 md:col-span-2">
                <h2 className="font-bold text-3xl mb-4">Profile</h2>
                <div className="relative w-full overflow-x-auto border border-gray-200 shadow-md sm:rounded-lg">
                  <table className="w-full text-left">
                    <tbody className="text-lg">
                      <tr className="odd:bg-white even:bg-slate-200">
                        <th className="px-6 py-3">Name</th>
                        <td className="px-6 py-3">{doctor.data.name}</td>
                      </tr>
                      <tr className="odd:bg-white even:bg-slate-200">
                        <th className="px-6 py-3">Email</th>
                        <td className="px-6 py-3">{doctor.data.email}</td>
                      </tr>
                      <tr className="odd:bg-white even:bg-slate-200">
                        <th className="px-6 py-3">Date of Birth</th>
                        <td className="px-6 py-3">{doctor.data.dob}</td>
                      </tr>
                      <tr className="odd:bg-white even:bg-slate-200">
                        <th className="px-6 py-3">Years of Experience</th>
                        <td className="px-6 py-3">
                          {doctor.data.yoe}{" "}
                          {doctor.data.yoe === 1 ? "year" : "years"}
                        </td>
                      </tr>
                      <tr className="odd:bg-white even:bg-slate-200">
                        <th className="px-6 py-3">Fee</th>
                        <td className="px-6 py-3">
                          {formatToRupiah(Number(doctor.data.fee))}
                        </td>
                      </tr>
                      <tr className="odd:bg-white even:bg-slate-200">
                        <th className="px-6 py-3">Specialization</th>
                        <td className="px-6 py-3">
                          {doctor.data.specialization.name}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="font-bold text-xl mt-8 mb-6">Certificate</div>
                <object
                  data={doctor.data.certificate}
                  type="application/pdf"
                  className="w-full min-h-[350px]"
                >
                  <iframe
                    src={doctor.data.certificate}
                    className="w-full min-h-[350px]"
                  />
                </object>
              </BaseCard>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default DoctorProfile;
