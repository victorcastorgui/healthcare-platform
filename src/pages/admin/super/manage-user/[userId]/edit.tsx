import Button from "@/components/Button/Button";
import AdminHeader from "@/components/Header/AdminHeader";
import { InputField } from "@/components/Input/InputField";
import AdminLayout from "@/components/Layout/AdminLayout";
import Spinner from "@/components/Loading/Spinner";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { useFetch } from "@/hooks/useFetch";
import { regOnlyChars, regOnlyNumber, regValidEmail } from "@/lib/regexLib";
import {
  PharmacyAdmin,
  PharmacyAdminDetail,
  PostResponse,
  TFormAdminErr,
} from "@/types";
import { getToken } from "@/utils/token";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const EditPharmacyAdmin = () => {
  const router = useRouter();
  const pharmacyUserId = router.query.userId;
  const token = getToken();
  const { data, fetchData: updateData, error, isLoading } = useFetch();
  const [formAdmin, setFormAdmin] = useState<Partial<PharmacyAdmin>>({
    email: "",
    name: "",
    phone: "",
  });
  const [formAdminErr, setFormAdminErr] = useState<Partial<TFormAdminErr>>({
    email: "",
    name: "",
    phone: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const userDetail = useCustomSWR<PharmacyAdminDetail>(
    pharmacyUserId ? `${apiBaseUrl}/admins-pharmacy/${pharmacyUserId}` : null
  );

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormAdminErr((prevData) => {
      return {
        ...prevData,
        [inpName]: "",
      };
    });
    const inpName = e.target.name;
    let inpValue = e.target.value;
    if (inpName === "phone") {
      if (inpValue.length > 14) {
        return;
      }
      inpValue = inpValue.replace(regOnlyChars, "");
    }
    if (inpName === "name") {
      inpValue = inpValue.replace(regOnlyNumber, "");
    }
    setFormAdmin((prevData) => {
      return {
        ...prevData,
        [inpName]: inpValue,
      };
    });
  };

  const handleUpdate = async (e: FormEvent) => {
    let valid = true;
    e.preventDefault();
    if (
      !regValidEmail.test(formAdmin.email!) &&
      formAdmin.email !== userDetail.data?.data.email
    ) {
      valid = false;
      setFormAdminErr((prevData) => {
        return {
          ...prevData,
          email: "Invalid email format, i.e. john@example.com",
        };
      });
    }

    if (formAdmin.phone![0] !== "0" || formAdmin.phone!.length < 10) {
      valid = false;
      setFormAdminErr((prevData) => {
        return {
          ...prevData,
          phone: "Phone number not valid. i.e. 087654897623 (min. 10 numbers)",
        };
      });
    }

    for (const key in formAdmin) {
      if (formAdmin[key as keyof PharmacyAdmin] === "") {
        valid = false;

        const errMess = "Field must be filled!";
        setFormAdminErr((prevData) => {
          return {
            ...prevData,
            [key]: errMess,
          };
        });
      }
    }

    if (!valid) {
      setIsButtonDisabled(true);
      return;
    }

    const url = `${apiBaseUrl}/admins-pharmacy/${pharmacyUserId}`;
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formAdmin),
    };
    await updateData(url, options);
  };

  useEffect(() => {
    const res = data as PostResponse;
    if (res.message !== undefined) {
      if (res.message.toLowerCase() === "update success") {
        toast.success("Update Pharmacy Admin Successfull!");
        if (!isLoading) {
          router.back();
        }
        return;
      }
    }
    if (error !== null) {
      toast.error("Update failed! Please check your server.");
    }
  }, [data, error, router, isLoading]);

  useEffect(() => {
    for (const k in formAdminErr) {
      const key = k as keyof TFormAdminErr;
      if (key !== "password" && userDetail.data !== undefined) {
        if (
          formAdmin[key] !== userDetail.data.data[key] &&
          formAdminErr[key] === ""
        ) {
          setIsButtonDisabled(false);
        }
      } else {
        setIsButtonDisabled(true);
      }
    }
  }, [formAdminErr, formAdmin, userDetail.data]);

  useEffect(() => {
    if (userDetail.data !== undefined) {
      setFormAdmin(userDetail.data.data);
    }
  }, [userDetail.data]);

  return (
    <AdminLayout>
      <Head>
        <title>Edit Admin Pharmacy | Super Admin</title>
      </Head>
      <AdminHeader>Edit Admin Pharmacy</AdminHeader>
      <div className="mt-8 flex flex-col gap-4 max-lg:items-center">
        <div className="flex w-full justify-start">
          <div className="w-16">
            <Button onClick={() => router.back()} variants="secondary">
              Back
            </Button>
          </div>
        </div>
        {userDetail.error && (
          <div>Error when fetch the data. Please refresh the page.</div>
        )}
        {userDetail.isLoading && <Spinner />}
        {userDetail.data && (
          <form className="w-full" onSubmit={handleUpdate}>
            <div className="flex flex-col w-full">
              <div className="flex flex-col md:flex-row md:gap-6 w-full">
                <InputField
                  type="text"
                  name="email"
                  value={formAdmin.email!}
                  onChange={handleOnChange}
                  label="Email"
                  err={formAdminErr.email}
                />
              </div>
              <div className="flex flex-col md:flex-row md:gap-6 w-full">
                <InputField
                  type="text"
                  name="name"
                  value={formAdmin.name!}
                  onChange={handleOnChange}
                  label="Name"
                  err={formAdminErr.name}
                />

                <InputField
                  type="text"
                  name="phone"
                  value={formAdmin.phone!}
                  onChange={handleOnChange}
                  label="Phone Number"
                  err={formAdminErr.phone}
                />
              </div>
            </div>
            <div className="flex w-full justify-end mt-8">
              <div className="w-52">
                <Button
                  type="submit"
                  variants="primary"
                  disabled={isLoading || isButtonDisabled}
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditPharmacyAdmin;
