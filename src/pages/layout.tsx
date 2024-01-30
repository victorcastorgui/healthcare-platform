import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navigation/Navbar";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  if (router.pathname.startsWith("/auth")) {
    return children;
  }
  if (router.pathname.startsWith("/admin")) {
    return children;
  }
  if (router.pathname === "_error") {
    return children;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen z-20">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
