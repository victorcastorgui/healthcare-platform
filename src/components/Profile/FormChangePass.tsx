import { apiBaseUrl } from "@/config";
import { useFetch } from "@/hooks/useFetch";
import { getToken } from "@/utils/token";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { InputField } from "../Input/InputField";
import Button from "../Button/Button";

type TFormChangePass = {
  setIsEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChangePass: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormChangePass = ({
  setIsEditProfile,
  setIsChangePass,
}: TFormChangePass) => {
  const [formResetPass, setFormResetPass] = useState({
    old_password: "",
    new_password: "",
  });
  const [errorPass, setErrorPass] = useState({
    old_password: "",
    new_password: "",
  });
  const {
    data: newPass,
    errorMsg: errorNewPass,
    setData: setNewPass,
    setErrorMsg: setErrorNewPass,
    fetchData: changePassword,
  } = useFetch();

  const token = getToken();

  useEffect(() => {
    if (newPass) {
      toast.success("Change password success!");
      setIsEditProfile(false);
      setIsChangePass(false);
      setNewPass(null);
    }
    if (errorNewPass) {
      toast.error(errorNewPass);
      setErrorNewPass("");
    }
  }, [newPass, errorNewPass]);

  const handleChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormResetPass((formResetPass) => ({ ...formResetPass, [name]: value }));
    setErrorPass({
      ...errorPass,
      [name]:
        value.trim().length < 8 ? "Input must be at least 8 characters" : "",
    });
  };

  const validatePass = (): boolean => {
    let isValid = true;
    const newErrors = { ...errorPass };

    const fieldsToValidate = ["old_password", "new_password"];

    fieldsToValidate.forEach((fieldName) => {
      const value = formResetPass[fieldName as keyof typeof formResetPass];
      const errorMessage =
        value.trim().length < 8 ? "Input must be at least 8 characters" : "";

      newErrors[fieldName as keyof typeof newErrors] = errorMessage;

      if (errorMessage) {
        isValid = false;
      }
    });

    setErrorPass(newErrors);
    return isValid;
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = validatePass();

    if (isFormValid) {
      await changePassword(`${apiBaseUrl}/users/reset-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formResetPass),
      });
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center pb-6">
      <div className="w-24 self-start">
        <Button
          variants="secondary"
          onClick={(e) => {
            e.preventDefault();
            setIsEditProfile(false);
            setIsChangePass(false);
          }}
        >
          Back
        </Button>
      </div>

      <div className="font-bold text-primary text-3xl mb-4">Password</div>
      <div className="flex flex-col w-96 gap-8">
        <form onSubmit={handleResetPassword}>
          <InputField
            label="Old Password:"
            name="old_password"
            type="password"
            placeholder="Input old password here.."
            value={formResetPass.old_password}
            onChange={(e) => handleChangePass(e)}
            err={errorPass.old_password}
            isPassword
            showEye
          />
          <InputField
            label="New Password:"
            name="new_password"
            type="password"
            placeholder="Input new password here.."
            value={formResetPass.new_password}
            onChange={(e) => handleChangePass(e)}
            err={errorPass.new_password}
            isPassword
            showEye
          />
          <div className="mt-4">
            <Button type="submit" variants="primary">
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormChangePass;
