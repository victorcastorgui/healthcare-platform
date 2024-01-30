import { ReactNode } from "react";

function AdminHeader({ children }: { children: ReactNode }) {
  return <h2 className="text-3xl max-lg:text-center">{children}</h2>;
}

export default AdminHeader;
