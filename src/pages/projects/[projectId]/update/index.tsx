import { api } from "@/utils/api";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const ProjectDetails = () => {
  const router = useRouter();
  const projectId = parseInt(router.query.projectId as string);

  const { data: project } = api.projects.get.useQuery(
    { id: projectId },
    { enabled: !!projectId },
  );

  const { data: members } = api.projects.getMember.useQuery(
    { id: projectId },
    { enabled: !!projectId },
  );

  const utils = api.useUtils();
  const updateproject = api.projects.update.useMutation();
  const addMember = api.projects.addMember.useMutation();

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!project) return;
    setDescription(project?.description);
    setTitle(project?.title);
  }, [project]);

  const handleSubmit = async () => {
    const toastId = toast("Updating project details", { isLoading: true });

    await updateproject
      .mutateAsync({
        projectId: projectId,
        title: title,
        description: description,
      })
      .catch(() => {
        toast.update(toastId, {
          render: "Error occured",
          isLoading: false,
          type: "error",
          autoClose: 5000,
        });
      });

    toast.update(toastId, {
      render: "Project updated successfully",
      isLoading: false,
      type: "success",
      autoClose: 5000,
    });
    await utils.projects.get.invalidate({ id: projectId });
  };

  const handleInvite = async () => {
    const toastId = toast("Adding member", { isLoading: true });

    await addMember
      .mutateAsync({
        projectId: projectId,
        email: email,
      })
      .catch(() => {
        toast.update(toastId, {
          render: "Error occured",
          isLoading: false,
          type: "error",
          autoClose: 5000,
        });
      });

    toast.update(toastId, {
      render: "Member added successfully",
      isLoading: false,
      type: "success",
      autoClose: 5000,
    });
    await utils.projects.get.invalidate({ id: projectId });
    await utils.projects.getMember.invalidate({ id: projectId });
  };

  return (
    <>
      <Head>
        <title>Project Settings</title>
        <meta
          name="description"
          content="Shows all tasks created within a project with other project details"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col bg-white px-10 sm:px-20 sm:py-10 md:px-28 lg:px-60">
        <div className="mb-10 flex items-center gap-4 text-black">
          <div onClick={() => router.back()} className="cursor-pointer">
            <MdOutlineKeyboardBackspace size={30} color="black" />
          </div>
          <h1 className="text-lg font-semibold">Project Settings</h1>
        </div>
        <div className="mb-5 flex w-full flex-col gap-3">
          <div className="w-full">
            <input
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-700 outline-none"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="w-full">
            <textarea
              className="h-40 w-full rounded-md border border-gray-300 bg-white p-2 text-gray-700 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="w-fit">
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
        {/* Members */}
        <div className="flex flex-col gap-4">
          <h1 className="text-lg font-semibold text-black">Members</h1>
          <div className="flex flex-wrap gap-4">
            {!!members &&
              members.map((member) => (
                <div className="rounded-md bg-neutral-50 p-4" key={member.id}>
                  <p className="text-black">{member.username}</p>
                  <p className="text-sm">{member.email}</p>
                </div>
              ))}
          </div>
          <h1 className="text-md font-medium text-black">Invite Members</h1>
          <div className="flex flex-wrap gap-4">
            <input
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-700 outline-none sm:w-1/2"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleInvite}>Invite</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
