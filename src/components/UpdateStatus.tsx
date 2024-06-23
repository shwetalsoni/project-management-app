import { MdEdit } from "react-icons/md";
import { api } from "@/utils/api";
import { useState } from "react";

const UpdateStatus = ({
  projectId,
  taskId,
}: {
  projectId: number;
  taskId: number;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const utils = api.useUtils();
  const updateStatus = api.tasks.updateStatus.useMutation();

  const handleUpdateStatus = async (status: "TODO" | "DOING" | "DONE") => {
    setDropdownOpen(false);
    await updateStatus.mutateAsync({ projectId, taskId, status }).catch(() => {
      alert("Failed to update status");
    });

    await utils.tasks.get.invalidate({ projectId, taskId });
  };

  return (
    <div className="dropdown dropdown-right">
      <div
        tabIndex={0}
        role="button"
        className="cursor-pointer"
        onClick={() => setDropdownOpen(true)}
      >
        <MdEdit size={20} />
      </div>
      {dropdownOpen && (
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] w-52 rounded-box p-2 shadow"
        >
          <li onClick={() => handleUpdateStatus("TODO")}>
            <a>TODO</a>
          </li>
          <li onClick={() => handleUpdateStatus("DOING")}>
            <a>DOING</a>
          </li>
          <li onClick={() => handleUpdateStatus("DONE")}>
            <a>DONE</a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UpdateStatus;
