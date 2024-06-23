import TaskForm from "@/components/TaskForm";
import Head from "next/head";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import type { FormValues } from "@/components/TaskForm";
import { toast } from "react-toastify";

const CreateTask = () => {
  const router = useRouter();
  const projectId = parseInt(router.query.projectId as string);

  const addTask = api.tasks.create.useMutation();

  const onSubmit = async (values: FormValues) => {
    const toastId = toast("creating task", { isLoading: true });

    const newTask = await addTask
      .mutateAsync({ ...values, projectId })
      .catch(() => {
        toast.update(toastId, {
          render: "Error occured",
          isLoading: false,
          type: "error",
          autoClose: 5000,
        });
      });
    if (!newTask) return;

    toast.update(toastId, {
      render: "Task created successfully",
      isLoading: false,
      type: "success",
      autoClose: 5000,
    });

    void router.push(`/projects/${projectId}/tasks/${newTask.data.task.id}`);
  };

  return (
    <>
      <Head>
        <title>Create task page</title>
        <meta name="description" content="Update task details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TaskForm
        header="Create Task"
        onSubmit={onSubmit}
        projectId={projectId}
      />
    </>
  );
};

export default CreateTask;
