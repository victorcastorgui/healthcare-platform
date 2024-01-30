import Button from "@/components/Button/Button";
import AdminHeader from "@/components/Header/AdminHeader";
import { InputField } from "@/components/Input/InputField";
import AdminLayout from "@/components/Layout/AdminLayout";
import { apiBaseUrl } from "@/config";
import { useFetch } from "@/hooks/useFetch";
import { regOnlyChars, regOnlyNumber, regValidEmail } from "@/lib/regexLib";
import { PharmacyAdmin, TFormAdminErr, PostResponse } from "@/types";
import { getToken } from "@/utils/token";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const Add = () => {
  const router = useRouter();
  const { data, fetchData: postData, error, isLoading } = useFetch();
  const token = getToken();
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [formAdmin, setFormAdmin] = useState<PharmacyAdmin>({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [formAdminErr, setFormAdminErr] = useState<TFormAdminErr>({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const handleOnSubmit = async (e: FormEvent) => {
    let valid = true;
    e.preventDefault();

    if (
      formAdmin.phone[0] !== "0" ||
      (formAdmin.phone.length < 10 && formAdmin.phone !== "")
    ) {
      valid = false;
      setFormAdminErr((prevData) => {
        return {
          ...prevData,
          phone: "Phone number not valid. i.e. 087654897623 (min. 10 numbers)",
        };
      });
    }

    if (!regValidEmail.test(formAdmin.email) && formAdmin.email !== "") {
      valid = false;
      setFormAdminErr((prevData) => {
        return {
          ...prevData,
          email: "Invalid email format, i.e. john@example.com",
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
    const URL = `${apiBaseUrl}/admins-pharmacy`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formAdmin),
    };
    await postData(URL, options);
  };

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

  useEffect(() => {
    const res = data as PostResponse;
    if (res.message === "create success") {
      toast.success("Create Pharmacy Admin Successfull!");
      if (!isLoading) {
        router.back();
      }
      return;
    }
    if (error !== null) {
      toast.error("Create failed! Please check your server.");
    }
  }, [data, error, router, isLoading]);

  useEffect(() => {
    for (const k in formAdminErr) {
      const key = k as keyof TFormAdminErr;
      if (
        (formAdmin[key] === "" || formAdmin[key] !== "") &&
        formAdminErr[key] === ""
      ) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    }
  }, [formAdminErr, formAdmin]);

  return (
    <AdminLayout>
      <Head>
        <title>Add Admin Pharmacy | Super Admin</title>
      </Head>
      <AdminHeader>Add Admin Pharmacy</AdminHeader>
      <div className="mt-8 flex flex-col gap-4 max-lg:items-center">
        <div className="flex w-full justify-start">
          <div className="w-16">
            <Button onClick={() => router.back()} variants="secondary">
              Back
            </Button>
          </div>
        </div>
        <form className="w-full" onSubmit={handleOnSubmit}>
          <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row md:gap-6 w-full">
              <InputField
                type="text"
                name="email"
                value={formAdmin.email}
                onChange={handleOnChange}
                label="Email"
                err={formAdminErr.email}
              />
              <InputField
                type="password"
                name="password"
                value={formAdmin.password}
                onChange={handleOnChange}
                label="Password"
                err={formAdminErr.password}
              />
            </div>
            <div className="flex flex-col md:flex-row md:gap-6 w-full">
              <InputField
                type="text"
                name="name"
                value={formAdmin.name}
                onChange={handleOnChange}
                label="Name"
                err={formAdminErr.name}
              />

              <InputField
                type="text"
                name="phone"
                value={formAdmin.phone}
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
      </div>
    </AdminLayout>
  );
};

export default Add;
