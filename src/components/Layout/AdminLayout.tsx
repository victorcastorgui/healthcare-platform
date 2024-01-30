import { ReactNode } from "react";
import SideBar from "../Navigation/SideBar";

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex bg-gradient-to-b from-[#36A5B2] via-[#36A5B2] to-[#A5D0D4]">
      <SideBar />
      <div className="w-full">
        <div className="max-lg:rounded-none rounded-l-[5rem] bg-whitebg h-screen overflow-y-auto scrollbar-custom">
          <div className="w-4/5 m-auto pt-24 flex flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
