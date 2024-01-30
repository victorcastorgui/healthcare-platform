import { ReactNode } from "react";

function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center bg-gradient-to-tr from-[#36A5B2] via-[#36A5B2] to-[#F2F3F9] w-screen h-screen">
      <div className="h-[40rem] w-4/5 max-w-screen-xl bg-white rounded-[1rem] bg-gradient-to-r from-[#F2F3F9] via-[#F2F3F9] to-[#36A5B2] shadow-2xl flex">
        {children}
      </div>
    </div>
  );
}

export default AuthCard;
