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

function User() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");

  const [disabled, setDisabled] = useState(false);
  const [errorNMsg, setErrorNMsg] = useState("");
  const [errorPMsg, setErrorPMsg] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [errorDMsg, setErrorDMsg] = useState("");

  const { query } = useRouter();
  const { fetchData: postData } = useFetch();
  const { push } = useRouter();

  useEffect(() => {
    const currentDate = new Date();
    const maxDate = new Date(currentDate);
    const currentDateTime = currentDate.toISOString().slice(0, 10);
    maxDate.setFullYear(maxDate.getFullYear() - 17).toString();
    setMaxDate(maxDate.toISOString().split("T")[0]);
    setCurrentDate(currentDateTime);
  }, []);

  useEffect(() => {
    setErrorNMsg("");
    setDisabled(false);
  }, [name]);

  useEffect(() => {
    setErrorPMsg("");
    setDisabled(false);
  }, [password]);

  useEffect(() => {
    setErrorDMsg("");
    setDisabled(false);
  }, [dob]);

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handleVerify = () => {
    const birth = new Date(dob);
    const currDate = new Date(currentDate);
    const nameRegex =
      /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const minAge = 17;
    let error = false;
    if (!disabled) {
      if (name === "") {
        setErrorNMsg("Name is required!");
        error = true;
      } else {
        const validateName = nameRegex.test(name);
        if (!validateName) {
          setErrorNMsg("Name must have more than 5 characters!");
          error = true;
        }
      }

      if (password === "") {
        setErrorPMsg("Password is required!");
        error = true;
      } else {
        const validatePassword = passwordRegex.test(password);
        if (!validatePassword) {
          setErrorPMsg(
            "Password must contain at least one uppercase, number, and minimal 8 characters!"
          );
          error = true;
        }
      }
      if (dob === "") {
        setErrorDMsg("Date Of Birth required!");
        error = true;
      } else if (currDate.getFullYear() - birth.getFullYear() < minAge) {
        setErrorDMsg("Must be at least 17 years old!");
        error = true;
      }
      if (error) {
        setDisabled(true);
        return;
      }
    }
    handleCreateAccount();
  };

  const handleCreateAccount = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("password", password);
    formData.append("dob", dob);

    const URL = `${apiBaseUrl}/auth/verify/1?token=${query.token}`;
    const options = {
      method: "POST",
      body: formData,
    };

    await postData(URL, options);
    toast.success("Account has been created!");
    push("/auth/login");
  };

  return (
    <>
      <Head>
        <title>Verify User</title>
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
                type="text"
                name="fullname"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Full Name"
                err={errorNMsg}
                onKeyDown={handleOnKeyDown}
              />
              <InputField
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                err={errorPMsg}
                onKeyDown={handleOnKeyDown}
              />
              <InputField
                type="date"
                name="dateofbirth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                err={errorDMsg}
                max={maxDate}
                onKeyDown={handleOnKeyDown}
              />
            </div>
            <Button
              variants="primary"
              customStyle="shadow-2xl disabled:bg-gray-100 disabled:!text-black"
              onClick={handleVerify}
              disabled={disabled}
            >
              Create Account
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
