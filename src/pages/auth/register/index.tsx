import Button from "@/components/Button/Button";
import AuthCard from "@/components/Card/AuthCard";
import Logo from "@/components/Logo/Logo";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

function Register() {
  const { push } = useRouter();
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <AuthCard>
        <div className="flex flex-col w-4/5 mx-auto justify-center gap-[10rem] max-sm:gap-[4.3rem] items-center">
          <Logo variant="primary" />
          <div className="flex justify-between gap-[4rem] w-4/5 max-md:w-full max-sm:flex-col">
            <div className="w-[100%]">
              <Button
                variants="primary"
                customStyle="text-[1.2rem] h-[7.375rem] flex flex-col shadow-2xl"
                onClick={() => push("/auth/register/1")}
              >
                Sign Up as
                <span>User</span>
              </Button>
            </div>
            <div className="w-[100%]">
              <Button
                variants="primary"
                customStyle="text-[1.2rem] h-[7.375rem] flex flex-col shadow-2xl"
                onClick={() => push("/auth/register/2")}
              >
                Sign Up as
                <span>Doctor</span>
              </Button>
            </div>
          </div>
          <Link className="text-center" href="/auth/login">
            Have an account? Login here!
          </Link>
        </div>
      </AuthCard>
    </>
  );
}

export default Register;
