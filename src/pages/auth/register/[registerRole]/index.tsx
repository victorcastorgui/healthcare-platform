import Button from "@/components/Button/Button";
import AuthCard from "@/components/Card/AuthCard";
import { InputField } from "@/components/Input/InputField";
import Logo from "@/components/Logo/Logo";
import { useFetch } from "@/hooks/useFetch";
import { FormatTime } from "@/utils/formatter/FormatTime";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AuthImage from "../../../../../public/images/authimage.jpg";
import { apiBaseUrl } from "@/config";

function User() {
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(120);
  const [disabled, setDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { query } = useRouter();
  const { push } = useRouter();
  const role_id = query.registerRole;
  const { data, fetchData: postData } = useFetch();

  useEffect(() => {
    if (data === null) {
      toast.error(`Account already exists!`);
    } else if (data === "") {
      return;
    } else {
      toast.success("Link has been sent, please check your email to verify!");
    }
  }, [data]);

  useEffect(() => {
    setErrorMsg("");
  }, [email]);

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

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleValidateEmail();
    }
  };

  const handleValidateEmail = () => {
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
    handleSendLink();
  };

  const handleSendLink = async () => {
    const URL = `${apiBaseUrl}/auth/register`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        role_id: parseInt(role_id as string),
      }),
    };
    await postData(URL, options);
    setCountdown(120);
    setDisabled(true);
  };

  return (
    <>
      <Head>
        <title>Register Role</title>
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
              <h3>REGISTER</h3>
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
              customStyle="shadow-2xl disabled:bg-black"
              onClick={handleValidateEmail}
              disabled={disabled}
            >
              Send Link
            </Button>
            <Link className="text-center" href="/auth/login">
              Have an account? Login here!
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

export default User;
