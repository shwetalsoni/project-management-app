import Button from "@/components/Button";
import ProjectCard from "@/components/ProjectCard";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";

export default function Projects() {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const { data: projects } = api.projects.getUserAllProjects.useQuery();
  const updateUsername = api.users.update.useMutation();

  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (!sessionData) return;
    setUsername(sessionData?.user.username);
  }, [sessionData]);

  const handleUsernameChange = async () => {
    const toastId = toast("Updating username", { isLoading: true });
    const modal = document.getElementById("username_modal");
    // @ts-expect-error: Let's ignore a compile error
    if (modal) modal.close?.(); // eslint-disable-line
    await updateUsername.mutateAsync({ username }).catch(() => {
      toast.update(toastId, {
        render: "Error occured",
        isLoading: false,
        type: "error",
        autoClose: 5000,
      });
    });

    toast.update(toastId, {
      render: "Username updated successfully",
      isLoading: false,
      type: "success",
      autoClose: 5000,
    });
  };

  return (
    <>
      <Head>
        <title>Projects page</title>
        <meta
          name="description"
          content="Displays all projects created by user"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-1 flex-col bg-white px-28 py-10 ">
        {/* set username modal */}
        <dialog id="username_modal" className="modal">
          <div className="modal-box bg-white">
            <h3 className="mb-3 text-lg font-bold text-gray-700">
              Set username
            </h3>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-5 w-full rounded-md border bg-white p-2"
            />
            <Button variant="primary" onClick={handleUsernameChange}>
              Submit
            </Button>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <div className="mb-10 flex flex-col items-center justify-center gap-5 sm:flex-row md:justify-start">
          <div className="flex flex-1 flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h1 className="text-center text-2xl font-medium text-cyan-800 sm:text-left sm:text-4xl">
              Hi {username}
            </h1>
            <div
              onClick={
                () =>
                  // @ts-expect-error: Let's ignore a compile error
                  document.getElementById("username_modal").showModal() // eslint-disable-line
              }
              className="cursor-pointer"
            >
              <MdEdit size={25} />
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => void router.push("/projects/create")}
          >
            Create Project
          </Button>
        </div>
        <h3 className="mb-8 text-center text-xl font-semibold text-gray-600 md:text-left">
          Projects Created
        </h3>

        {/* show created projects */}
        <div className="flex flex-wrap justify-center gap-6 md:justify-start">
          {projects?.length === 0 && (
            <p className="text-center">No projects created yet.</p>
          )}
          {!!projects &&
            projects.map((project, i) => (
              <div key={i}>
                <ProjectCard
                  id={project.id}
                  title={project.title}
                  description={project.description}
                />
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
