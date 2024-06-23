import Head from "next/head";
import { useRouter } from "next/router";
import TaskStatus from "@/components/TaskStatus";
import { api } from "@/utils/api";
import UpdateStatus from "@/components/UpdateStatus";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import Button from "@/components/Button";

const TaskDetails = () => {
  const router = useRouter();
  const taskId = parseInt(router.query.taskId as string);
  const projectId = parseInt(router.query.projectId as string);

  const { data: task } = api.tasks.get.useQuery(
    {
      projectId: projectId,
      taskId: taskId,
    },
    { enabled: !!taskId && !!projectId },
  );

  return (
    <>
      <Head>
        <title>Task details page</title>
        <meta name="description" content="Shows all task's details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex  flex-col gap-4 bg-white px-10 py-20 sm:px-28 lg:px-72">
        <div className="flex flex-wrap items-center">
          <div className="flex flex-1 flex-col gap-2">
            <div
              onClick={() => router.back()}
              className=" mb-10 w-fit cursor-pointer"
            >
              <MdOutlineKeyboardBackspace size={30} color="black" />
            </div>
            <h1 className="text-lg font-bold text-gray-700">{task?.title}</h1>
            <p className="text-sm text-gray-700">
              Deadline: {task?.deadline.toDateString()}
            </p>
            <p className="mb-4 text-sm italic text-gray-700">
              Assigned to: {task?.assignee?.username}
            </p>
          </div>
          {/* <button className="btn-sm rounded-full border-0 bg-cyan-700 text-white sm:btn sm:rounded-full sm:border-0 sm:bg-cyan-700 sm:text-white"></button> */}
          <Button
            onClick={() =>
              void router.push(`/projects/${projectId}/tasks/${taskId}/update`)
            }
          >
            Update task
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <TaskStatus status={task?.status.toString() ?? ""} size="large" />
          <UpdateStatus projectId={projectId} taskId={taskId} />
        </div>

        <p className="mb-4 py-4 text-justify text-sm text-gray-600">
          {task?.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {task?.tags.map((tag, i) => (
            <div
              key={i}
              className="flex items-center rounded-full bg-cyan-500 px-2 py-1 text-xs text-white"
            >
              {tag}
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default TaskDetails;
