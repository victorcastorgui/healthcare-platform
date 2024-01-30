import Button from "@/components/Button/Button";
import BaseCard from "@/components/Card/BaseCard";
import { InputField } from "@/components/Input/InputField";
import { apiBaseUrl } from "@/config";
import { useCustomSWR } from "@/hooks/useCustomSWR";
import { useFetch } from "@/hooks/useFetch";
import { TDoctor } from "@/types";
import { getToken } from "@/utils/token";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [yoe, setYoe] = useState("");
  const [certificate, setCertificate] = useState<File | null | undefined>(null);
  const doctor = useCustomSWR<TDoctor>(`${apiBaseUrl}/users/profile`);
  const { data, isLoading, fetchData } = useFetch();

  const token = getToken();
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<string | File>("");

  const [errors, setErrors] = useState({
    name: "",
    yoe: "",
    fee: "",
  });

  useEffect(() => {
    if (doctor && doctor.data) {
      setNewImage(doctor.data.image);
      setName(doctor.data.name);
      setFee(doctor.data.fee);
      setYoe(String(doctor.data.yoe));
    }
  }, [doctor.data]);

  useEffect(() => {
    if (data && !isLoading) {
      toast.success("Edit profile success!");
      router.push("/doctor/profile");
    }
  }, [data, isLoading]);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(e.target.value);

    setErrors({
      ...errors,
      name: value.trim().length < 3 ? "Name must be at least 3 characters" : "",
    });
  };

  const handleChangeYoe = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYoe(value);

    setErrors({
      ...errors,
      name: !value.trim() ? "Input required and must number" : "",
    });
  };

  const handleChangeFee = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFee(value);

    setErrors({
      ...errors,
      name:
        !value.trim() || /^\d+$/.test(value)
          ? "Input required and must number"
          : "",
    });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].size > 500000) {
      toast.error("Apologies, the maximum allowable image size is 500 kB.");
    } else if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setNewImage(e.target.files[0]);
    }
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].size > 1000000) {
      toast.error("Apologies, the maximum allowable certificate size is 1 mb.");
    } else if (e.target.files && e.target.files[0]) {
      setCertificate(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !name.trim() ? "Input required and must be a number" : "",
      yoe: !yoe.trim() ? "Input required and must number" : "",
      fee:
        !fee.trim() || /^\d+$/.test(fee)
          ? "Input required and must number"
          : "",
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = validateForm();

    if (isFormValid) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("yoe", String(yoe));
      formData.append("fee", fee);

      if (image !== null) {
        formData.append("image", newImage);
      }

      if (certificate !== null && certificate !== undefined) {
        formData.append("pdf", certificate);
      }

      await fetchData(`${apiBaseUrl}/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      setImage(null);
      return;
    }

    toast.error("Please fill all required fields correctly.");
  };

  return (
    <div className="bg-[url('https://everhealth-asset.irfancen.com/assets/background.png')] bg-cover min-h-screen">
      <Head>
        <title>Edit Profile</title>
      </Head>
      <section className="max-w-screen-sm md:max-w-screen-md mx-auto pt-24 pb-14">
        <div className="w-24 self-start mb-8">
          <Button
            variants="secondary"
            onClick={() => {
              router.push("/doctor/profile");
            }}
          >
            Back
          </Button>
        </div>

        <BaseCard>
          <h2 className="font-bold text-2xl mb-6">Edit Profile</h2>

          {doctor.data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="flex flex-col justify-center items-center">
                {image !== null ? (
                  <Image
                    src={image}
                    alt={`profile ${doctor.data.name}`}
                    width={300}
                    height={300}
                    className="rounded-full border-2 object-cover w-[220px] h-[220px]"
                  />
                ) : (
                  <Image
                    src={
                      doctor.data.image === null
                        ? `https://everhealth-asset.irfancen.com/assets/avatar-placeholder.png`
                        : doctor.data.image
                    }
                    alt={`profile ${doctor.data.name}`}
                    width={300}
                    height={300}
                    className="rounded-full border-2 object-cover w-[220px] h-[220px]"
                  />
                )}

                <label htmlFor="profileImage">
                  <div className="w-full btn btn-outline btn-primary hover:!text-[#F2F3F9] mt-3">
                    Change Image
                  </div>
                  <input
                    id="profileImage"
                    type="file"
                    className="hidden"
                    accept="image/png"
                    onChange={(e) => handleImage(e)}
                  />
                </label>
                <div className="text-sm text-[#999999] font-thin mt-3 mb-6">
                  *image must be png and max size is 500mb.
                </div>
              </div>

              <div className=" col-span-2">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 items-center justify-center pb-5 mx-8"
                >
                  <InputField
                    label="Name:"
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleChangeName}
                    value={name}
                    placeholder="Input name here.."
                    err={errors.name}
                  />

                  <InputField
                    label="Yoe:"
                    type="number"
                    name="yoe"
                    onChange={handleChangeYoe}
                    value={yoe}
                    placeholder="1"
                    err={errors.yoe}
                  />

                  <InputField
                    label="Fee:"
                    type="number"
                    name="fee"
                    onChange={handleChangeFee}
                    value={fee}
                    placeholder="fee"
                    err={errors.fee}
                  />

                  <input
                    type="file"
                    className="file-input file-input-bordered file-input-primary w-full mb-6"
                    onChange={(e) => handleCertificateUpload(e)}
                    accept="application/pdf"
                  />

                  <Button type="submit" variants="primary">
                    Edit
                  </Button>
                </form>
              </div>
            </div>
          )}
        </BaseCard>
      </section>
    </div>
  );
};

export default EditProfile;
