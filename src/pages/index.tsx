import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Button from "@/components/Button";
import { useRouter } from "next/router";

export default function Landing() {
  const { status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") void router.push("/projects");
  }, [status, router]);

  return (
    <>
      <Head>
        <title>PM App</title>
        <meta name="description" content="Project management app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-1 flex-col items-center justify-center bg-white ">
        <h1 className="mb-2 text-center text-4xl font-semibold text-gray-700">
          Welcome to project management app
        </h1>
        <h3 className="mb-7 text-center text-lg font-medium text-gray-700">
          Sign In to get started
        </h3>

        {status === "loading" ? (
          <Button disabled>Loading...</Button>
        ) : (
          <Button onClick={signIn}>Sign in</Button>
        )}
        <p className="mt-4 text-sm text-gray-700">Do not have an account?</p>
        <Link href="/signUp" className="text-gray-700 underline">
          Sign up
        </Link>
      </main>
    </>
  );
}
