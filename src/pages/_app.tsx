import "@/styles/globals.css";
import { getToken, removeRoleId, removeToken } from "@/utils/token";
import { jwtDecode } from "jwt-decode";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Toaster } from "sonner";
import Layout from "./layout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  const { push } = useRouter();
  const token = getToken();
  useEffect(() => {
    if (token) {
      const decode = jwtDecode(token as string);
      if (decode.exp !== undefined) {
        if (decode.exp! * 1000 <= Date.now()) {
          removeToken();
          removeRoleId();
          push("/auth/login");
        }
      }
    }
  });
  return (
    <>
      <Head>
        <link
          rel="shortcut icon"
          href="https://everhealth-asset.irfancen.com/assets/favicon.ico"
        />
      </Head>
      <Toaster richColors position="top-center" />
      <Layout>
        <main className={poppins.className}>
          <Component {...pageProps} />
        </main>
      </Layout>
    </>
  );
}
