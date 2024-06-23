import TaskForm from "@/components/TaskForm";
import Head from "next/head";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import type { FormValues } from "@/components/TaskForm";
import { toast } from "react-toastify";

const UpdateTask = () => {
  const router = useRouter();
  const projectId = parseInt(router.query.projectId as string);
  const taskId = parseInt(router.query.taskId as string);

  const { data: task } = api.tasks.get.useQuery(
    {
      taskId: taskId,
      projectId: projectId,
    },
    { enabled: !!projectId && !!taskId },
  );

  const updateTask = api.tasks.update.useMutation();

  const onSubmit = async (values: FormValues) => {
    const toastId = toast("Updating task", { isLoading: true });

    const res = await updateTask
      .mutateAsync({ ...values, projectId, taskId })
      .catch(() => {
        toast.update(toastId, {
          render: "Error occured",
          isLoading: false,
          type: "error",
          autoClose: 5000,
        });
      });
    if (!res) return;

    toast.update(toastId, {
      render: "Task updated successfully",
      isLoading: false,
      type: "success",
      autoClose: 5000,
    });
    void router.push(`/projects/${projectId}/tasks/${taskId}`);
  };

  return (
    <>
      <Head>
        <title>Update task page</title>
        <meta name="description" content="Update task details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TaskForm
        header="Update Task"
        _formValues={{
          title: task?.title ?? "",
          description: task?.description ?? "",
          tags: task?.tags ?? [],
          deadline: task?.deadline ?? new Date(),
          assigneeId: task?.assigneeId ?? "",
        }}
        onSubmit={onSubmit}
        projectId={projectId}
      />
    </>
  );
};

export default UpdateTask;
