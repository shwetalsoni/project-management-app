import Head from "next/head";
import { useRouter } from "next/router";
import TaskStatus from "@/components/TaskStatus";
import { api } from "@/utils/api";
import Link from "next/link";
import { MdOutlineSettings } from "react-icons/md";
import Button from "@/components/Button";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";

type Filters = {
  status: "TODO" | "DOING" | "DONE" | "ALL";
  assignee: "All" | "Me" | "Unassigned";
  sortByDeadline: boolean;
};

const Tasks = () => {
  const router = useRouter();
  const projectId = parseInt(router.query.projectId as string);

  const { data: sessionData } = useSession();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: "ALL",
    assignee: "All",
    sortByDeadline: true,
  });

  const { data: project } = api.projects.get.useQuery(
    { id: projectId },
    { enabled: !!projectId },
  );

  // Filter tasks based on set filters
  const tasks = useMemo(() => {
    if (!project || !sessionData) return [];
    const filteredTasks = project.tasks.filter((task) => {
      if (task.status === filters.status || filters.status === "ALL") {
        if (filters.assignee === "All") return true;
        if (
          filters.assignee === "Me" &&
          sessionData.user.id === task.assigneeId
        )
          return true;
        if (filters.assignee === "Unassigned" && !task.assigneeId) return true;
      }
      return false;
    });
    if (filters.sortByDeadline) {
      filteredTasks.sort((a, b) => +a.deadline - +b.deadline);
    }
    return filteredTasks;
  }, [project, filters, sessionData]);

  const handleStatusFilterChange = (status: Filters["status"]) => {
    setFilters((prev) => ({ ...prev, status }));
    setDropdownOpen(false);
  };

  const handleAssigneeFilterChange = (assignee: Filters["assignee"]) => {
    setFilters((prev) => ({ ...prev, assignee }));
    setDropdownOpen(false);
  };

  const handleDeadlineFilterChange = (
    sortByDeadline: Filters["sortByDeadline"],
  ) => {
    setFilters((prev) => ({ ...prev, sortByDeadline }));
  };

  return (
    <>
      <Head>
        <title>Project tasks page</title>
        <meta
          name="description"
          content="Shows all tasks created within a project."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col bg-white p-5 sm:px-28 sm:py-10">
        <div className="mb-10 flex items-center">
          <div className="flex flex-1 items-center gap-3 ">
            <h1 className="text-2xl font-semibold text-gray-700">
              {project?.title}
            </h1>
            <div
              onClick={() => void router.push(`/projects/${projectId}/update`)}
              className="cursor-pointer"
            >
              <MdOutlineSettings size={18} />
            </div>
          </div>

          <Link href={`/projects/${projectId}/tasks/create`}>
            <Button variant="primary">Add task</Button>
          </Link>
        </div>

        {/* filters */}

        <div className="mb-10 flex flex-wrap items-center gap-5">
          {/* status filter */}
          <div className="flex items-center gap-3">
            <div>Status</div>
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="border-bg-gray-500 cursor-pointer rounded-full border px-4 py-2"
                onClick={() => setDropdownOpen(true)}
              >
                {filters.status}
              </div>
              {dropdownOpen && (
                <ul
                  tabIndex={0}
                  className="menu dropdown-content absolute z-50 w-52 rounded-box bg-zinc-100 p-2 shadow"
                >
                  <li onClick={() => handleStatusFilterChange("TODO")}>
                    <a>Todo</a>
                  </li>
                  <li onClick={() => handleStatusFilterChange("DOING")}>
                    <a>Doing</a>
                  </li>
                  <li onClick={() => handleStatusFilterChange("DONE")}>
                    <a>Done</a>
                  </li>
                  <li onClick={() => handleStatusFilterChange("ALL")}>
                    <a>All</a>
                  </li>
                </ul>
              )}
            </div>
          </div>
          {/* assginee filter */}
          <div className="flex items-center gap-3">
            <div>Assignee</div>
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="border-bg-gray-500 cursor-pointer rounded-full border px-4 py-2"
                onClick={() => setDropdownOpen(true)}
              >
                {filters.assignee}
              </div>
              {dropdownOpen && (
                <ul
                  tabIndex={0}
                  className="menu dropdown-content absolute z-50 w-52 rounded-box bg-zinc-100 p-2 shadow"
                >
                  <li onClick={() => handleAssigneeFilterChange("All")}>
                    <a>All</a>
                  </li>
                  <li onClick={() => handleAssigneeFilterChange("Unassigned")}>
                    <a>Unassigned</a>
                  </li>
                  <li onClick={() => handleAssigneeFilterChange("Me")}>
                    <a>Me</a>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* sort by deadline */}
          <div className="flex items-center gap-3">
            <div>Sort by deadline</div>
            <input
              type="checkbox"
              defaultChecked
              className="checkbox-success checkbox checkbox-sm"
              onChange={() =>
                handleDeadlineFilterChange(!filters.sortByDeadline)
              }
            />
          </div>
        </div>

        {/* show created projects */}

        <div className="z-10 overflow-x-auto">
          <table className="table">
            <thead className="text-gray-500 ">
              <tr className="border-gray-400">
                <th className="text-lg">Title</th>
                <th className="text-lg">Status</th>
                <th className="text-lg">Assignee</th>
                <th className="text-lg">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {!!tasks &&
                tasks.map((task, i) => (
                  <tr
                    className="cursor-pointer border-gray-200 p-4 hover:bg-cyan-200 hover:bg-opacity-20"
                    key={i}
                    onClick={() =>
                      router.push(`/projects/${projectId}/tasks/${task.id}`)
                    }
                  >
                    <td className="text-gray-500">{task.title}</td>
                    <td>
                      <TaskStatus status={task.status} size="small" />
                    </td>
                    <td>
                      {!!task.assignee
                        ? task.assignee?.username
                        : "Not assigned"}
                    </td>
                    <td>{task.deadline.toDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Tasks;
