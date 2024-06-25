import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "./Button";
import Link from "next/link";
import { api } from "@/utils/api";

const Navbar = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const utils = api.useUtils();

  const handleSignOut = async () => {
    console.log("signing out");

    await signOut();
    console.log("signed out");
    await utils.invalidate();
    void router.push("/");

    console.log("pushed to /");
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-white px-4 py-4 sm:px-12">
      <Link href="/projects">
        <div className="font-medium text-gray-700">Dashboard</div>
      </Link>
      <div className="">
        {!!sessionData && (
          <Button variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
