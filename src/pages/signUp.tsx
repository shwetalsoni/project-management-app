import type { FormEvent } from "react";
import { useRouter } from "next/router";

import { api } from "@/utils/api";
import { toast } from "react-toastify";

export default function SignUp() {
  const router = useRouter();
  const mutation = api.signUp.create.useMutation({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return;
    }

    const res = await mutation
      .mutateAsync({ email, password })
      .catch((err: { message: string }) => {
        toast.error(err.message);
      });
    if (!res) return;
    void router.push("/");
  }

  return (
    <div className="flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="flex min-w-32 flex-col gap-4">
        <input
          className="w-60 rounded-md border border-gray-400 bg-white p-2 text-gray-800"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="rounded-md border border-gray-400 bg-white p-2 text-gray-800"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button className="btn bg-cyan-900 text-white" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}
