import { signOut } from "next-auth/react";

const SignOut = () => {
  return (
    <button
      className="rounded-full  border border-cyan-700  px-5 py-[6px] font-semibold text-cyan-800 no-underline hover:cursor-pointer"
      onClick={() => signOut()}
    >
      Sign out
    </button>
  );
};

export default SignOut;
