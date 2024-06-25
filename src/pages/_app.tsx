import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import clsx from "clsx";
import { useRouter } from "next/router";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { useEffect } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  useEffect(() => {
    if (session) return;
    if (router.pathname === "/" || router.pathname === "/signUp") return;
    void router.push("/");
  }, [session]);

  return (
    <SessionProvider session={session}>
      <ToastContainer />
      <main
        className={clsx(
          GeistSans.className,
          "flex min-h-screen flex-col bg-white",
        )}
      >
        <Navbar />
        <div className="flex flex-1 flex-col">
          <Component {...pageProps} />
        </div>
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
