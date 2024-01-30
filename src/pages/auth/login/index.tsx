import Button from "@/components/Button/Button";
import AuthCard from "@/components/Card/AuthCard";
import { InputField } from "@/components/Input/InputField";
import Logo from "@/components/Logo/Logo";
import { apiBaseUrl } from "@/config";
import { useFetch } from "@/hooks/useFetch";
import Cookies from "js-cookie";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AuthImage from "../../../../public/images/authimage.jpg";

type TLogin = {
  data: {
    token: string;
    role_id: number;
  };
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { data, fetchData: postData, error, setError } = useFetch<TLogin>();
  const [errorMsg, setErrorMsg] = useState("");
  const { back, push } = useRouter();

  useEffect(() => {
    const savedRemember = localStorage.getItem("remember") === "true";
    const savedEmail = localStorage.getItem("email") || "";

    setRemember(savedRemember);
    setEmail(savedEmail);
  }, []);

  useEffect(() => {
    const dataSuccess = data as TLogin;
    if (error !== null) {
      toast.error("Account not found!");
      setErrorMsg("Email or Password is Wrong!");
      setError(null);
      return;
    }

    if (data !== null) {
      if (dataSuccess?.data?.role_id !== undefined) {
        Cookies.set("roleId", dataSuccess.data.role_id.toString());
        Cookies.set("token", dataSuccess.data.token);
        toast.success("Login Successful!");
        if (dataSuccess.data.role_id === 1) {
          push("/");
        } else if (dataSuccess.data.role_id === 2) {
          push("/doctor");
        } else if (dataSuccess.data.role_id === 3) {
          push("/admin/pharmacy");
        } else if (dataSuccess.data.role_id === 4) {
          push("/admin/super");
        }
      }
    }
  }, [error, data]);

  useEffect(() => {
    setErrorMsg("");
  }, [email, password]);

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (remember) {
      localStorage.setItem("remember", "true");
      localStorage.setItem("email", email);
    } else {
      localStorage.removeItem("remember");
      localStorage.removeItem("email");
    }

    const URL = `${apiBaseUrl}/auth/login`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };
    await postData(URL, options);
  };

  return (
    <>
      <Head>
        <title>Login</title>
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
              <h3>SIGN IN</h3>
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
              <InputField
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                err={errorMsg}
                onKeyDown={handleOnKeyDown}
              />
            </div>
            <div className="max-[430px]:flex-col max-[430px]:gap-[1rem] flex justify-between gap-[0.5rem]">
              <label className="flex gap-[0.5rem]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Remember Me
              </label>
              <Link href="/auth/forgot-password">Forgot Password?</Link>
            </div>
            <Button onClick={handleLogin} variants="primary">
              Log In
            </Button>
            <Link className="text-center" href="/auth/register">
              Don&apos;t have an account? Register here!
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

export default Login;
