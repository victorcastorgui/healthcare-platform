import Button from "@/components/Button/Button";
import AuthCard from "@/components/Card/AuthCard";
import { InputField } from "@/components/Input/InputField";
import Logo from "@/components/Logo/Logo";
import { useFetch } from "@/hooks/useFetch";
import { FormatTime } from "@/utils/formatter/FormatTime";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AuthImage from "../../../../public/images/authimage.jpg";
import { apiBaseUrl } from "@/config";
import { useRouter } from "next/router";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(120);
  const [disabled, setDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { data, fetchData: postData } = useFetch();
  const { push } = useRouter();

  useEffect(() => {
    setErrorMsg("");
    setDisabled(false);
  }, [email]);

  useEffect(() => {
    if (data === null) {
      toast.error(`Account does not exists!`);
    } else if (data === "") {
      return;
    } else {
      toast.success(
        "Link has been sent, please check your email to change password!"
      );
    }
  }, [data]);

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendLink();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (disabled && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    return () => clearInterval(interval);
  }, [countdown, disabled]);

  const handleSendLink = async () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (email === "") {
      setErrorMsg("Email is required!");
      return;
    } else {
      const validateEmail = emailRegex.test(email);
      if (!validateEmail) {
        setErrorMsg("Invalid email!");
        return;
      }
    }
    const URL = `${apiBaseUrl}/auth/forgot-password`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    };

    await postData(URL, options);
    setCountdown(120);
    setDisabled(true);
  };
  return (
    <>
      <Head>
        <title>Forgot Password</title>
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
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                err={errorMsg}
                onKeyDown={handleOnKeyDown}
              />
              <span>Resend link in {FormatTime(countdown)}</span>
            </div>
            <Button
              variants="primary"
              customStyle="shadow-2xl"
              onClick={handleSendLink}
              disabled={disabled}
            >
              Send Link
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

export default ForgetPassword;
