import React from "react";
import Button from "../Button/Button";
import { TUser } from "@/types";
import Image from "next/image";

type TProfile = {
  user: TUser;
  setIsEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChangePass: React.Dispatch<React.SetStateAction<boolean>>;
};

function Profile({ user, setIsEditProfile, setIsChangePass }: TProfile) {
  return (
    <div className="flex flex-col justify-center items-center gap-3 md:gap-5 pt-4 pb-6">
      <Image
        src={
          user.image !== ""
            ? user.image
            : "https://everhealth-asset.irfancen.com/assets/avatar-placeholder.png"
        }
        alt={`profile ${user.name}`}
        width={220}
        height={220}
        className="rounded-full border-2 object-cover w-[150px] h-[150px] md:w-[220px] md:h-[220px]"
        priority
      />
      <div className="font-semibold text-lg md:text-2xl">Name: {user.name}</div>
      <div className="font-semibold text-lg md:text-2xl">
        Email: {user.email}
      </div>
      <div className="font-semibold text-lg md:text-2xl">Dob: {user.dob}</div>
      <div className="flex  justify-center items-center gap-4 max-w-32 md:max-w-48">
        <Button
          variants="primary"
          onClick={(event) => {
            event.preventDefault();
            setIsEditProfile(true);
          }}
        >
          Edit Profile
        </Button>
        <Button
          variants="primary"
          onClick={(event) => {
            event.preventDefault();
            setIsChangePass(true);
            setIsEditProfile(true);
          }}
        >
          Change Password
        </Button>
      </div>
    </div>
  );
}

export default Profile;
