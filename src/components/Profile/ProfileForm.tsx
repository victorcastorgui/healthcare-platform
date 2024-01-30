import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import { TUser } from "@/types";
import Image from "next/image";
import { InputField } from "../Input/InputField";
import { useFetch } from "@/hooks/useFetch";
import { apiBaseUrl } from "@/config";
import { toast } from "sonner";
import Spinner from "../Loading/Spinner";
import { getToken } from "@/utils/token";
import { useCustomSWR } from "@/hooks/useCustomSWR";

type TProfile = {
  user: TUser;
  setIsEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileForm = ({ user, setIsEditProfile }: TProfile) => {
  const [image, setImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<string | File>(user.image);
  const [name, setName] = useState<string>(user.name);
  const newUser = useCustomSWR<TUser>(`${apiBaseUrl}/users/profile`);
  const { data, isLoading, error, fetchData: updateProfile } = useFetch();
  const token = getToken();

  useEffect(() => {
    if (data && !isLoading && error === null) {
      toast.success("Edit profile success!");
      setIsEditProfile(false);
      newUser.mutate();
    }
  }, [data, isLoading]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].size > 500000) {
      toast.error("Apologies, the maximum allowable image size is 500 kB.");
    } else if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setNewImage(e.target.files[0]);
    }
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", name);

    if (image !== null) {
      data.append("image", newImage);
    }

    await updateProfile(`${apiBaseUrl}/users/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    setImage(null);
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center pb-6">
      <div className="w-24 self-start">
        <Button
          variants="secondary"
          onClick={(e) => {
            e.preventDefault();
            setIsEditProfile(false);
          }}
        >
          Back
        </Button>
      </div>
      {image !== null ? (
        <Image
          src={image}
          alt={`profile ${user.name}`}
          width={300}
          height={300}
          className="rounded-full border-2 object-cover w-[220px] h-[220px]"
        />
      ) : (
        <Image
          src={
            user.image === ""
              ? `https://everhealth-asset.irfancen.com/assets/avatar-placeholder.png`
              : user.image
          }
          alt={`profile ${user.name}`}
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

      <div className="flex flex-col w-full md:w-96 gap-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center"
        >
          <InputField
            label="Name:"
            name="name"
            type="text"
            value={name}
            onChange={(e) => handleChangeName(e)}
          />
          <InputField
            label="Email:"
            name="email"
            type="text"
            value={user.email}
            onChange={() => user.email}
            disabled
          />
          <InputField
            label="DOB:"
            name="dob"
            type="text"
            value={user.dob}
            onChange={() => user.dob}
            disabled
          />
          <div className="mt-4 w-full">
            <Button type="submit" variants="primary" disabled={isLoading}>
              {!isLoading ? "Save" : <Spinner />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
