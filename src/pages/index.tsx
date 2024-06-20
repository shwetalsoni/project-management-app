import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

// import { api } from "@/utils/api";

export default function Landing() {
  // const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>PM App</title>
        <meta name="description" content="Project management app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-white ">
        <h1 className="mb-2 text-center text-4xl font-semibold text-gray-700">
          Welcome to project management app
        </h1>
        <h3 className="mb-7 text-center text-lg font-medium text-gray-700">
          Sign In to get started
        </h3>
        <Auth />
        <p className="mt-4 text-sm text-gray-700">Do not have an account?</p>
        <Link href="/signUp" className="text-gray-700 underline">
          Sign up
        </Link>
      </main>
    </>
  );
}

function Auth() {
  const { data: sessionData } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (sessionData) void router.push("/projects");
  }, [sessionData]);
  // const { data: secretMessage } = api.post.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined },
  // );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-cyan-700  px-10 py-3 font-semibold text-white no-underline transition hover:bg-cyan-900"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
