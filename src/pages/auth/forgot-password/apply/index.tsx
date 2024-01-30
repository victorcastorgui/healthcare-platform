import Button from "@/components/Button/Button";
import AuthCard from "@/components/Card/AuthCard";
import { InputField } from "@/components/Input/InputField";
import Logo from "@/components/Logo/Logo";
import { apiBaseUrl } from "@/config";
import { useFetch } from "@/hooks/useFetch";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AuthImage from "../../../../../public/images/authimage.jpg";

type TResetPass = {
  message: string;
};

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [errorPMsg, setErrorPMsg] = useState("");
  const { push } = useRouter();
  const { query } = useRouter();
  const {
    data,
    error,
    errorMsg,
    fetchData: putData,
    setError,
  } = useFetch<TResetPass>();

  useEffect(() => {
    setErrorPMsg("");
    setDisabled(false);
  }, [password]);

  useEffect(() => {
    const dataSuccess = data as TResetPass;
    if (error !== null) {
      toast.error(errorMsg![0]);
      setError(null);
      return;
    }

    if (data !== null) {
      if (dataSuccess?.message === "password changed") {
        toast.success("Password has been changed!");
        push("/auth/login");
      }
    }
  }, [data, error]);

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };
  const handleVerify = () => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    let error = false;
    if (!disabled) {
      if (password === "") {
        setErrorPMsg("Password is required!");
        error = true;
      } else {
        const validatePassword = passwordRegex.test(password);
        if (!validatePassword) {
          setErrorPMsg(
            "Password must contain at least one uppercase and number!"
          );
          error = true;
        }
      }
      if (error) {
        setDisabled(true);
        return;
      }
    }
    handleChangePassword();
  };

  const handleChangePassword = async () => {
    const URL = `${apiBaseUrl}/auth/forgot-password?token=${query.token}`;
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: password,
      }),
    };
    await putData(URL, options);
  };

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <AuthCard>
        <div className="max-sm:w-full w-3/5 h-full flex justify-center">
          <div className="max-sm:w-4/5 w-3/5 flex flex-col gap-y-[2rem] my-auto">
            <div>
              <div className="flex items-center justify-between">
                <Logo variant="primary" />
                <Button
                  customStyle={"!w-16"}
                  variants="secondary"
                  onClick={() => push("/")}
                >
                  Home
                </Button>
              </div>
              <h3>FORGOT PASSWORD</h3>
            </div>
            <div>
              <InputField
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                err={errorPMsg}
                onKeyDown={handleOnKeyDown}
              />
            </div>
            <Button
              variants="primary"
              customStyle="shadow-2xl disabled:bg-gray-100 disabled:!text-black"
              onClick={handleVerify}
              disabled={disabled}
            >
              Reset Password
            </Button>
            <Link className="text-center" href="/auth/login">
              Remember Your Password? Login here!
            </Link>
          </div>
        </div>
        <div className="max-sm:hidden h-full w-2/5 rounded-r-[1rem] overflow-hidden">
          <Image
            className="h-[100%] object-cover"
            src={AuthImage}
            alt="a picture of medicine with tosca color"
          />
        </div>
      </AuthCard>
    </>
  );
}

export default ResetPassword;
