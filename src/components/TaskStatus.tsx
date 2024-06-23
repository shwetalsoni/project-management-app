import clsx from "clsx";

const TaskStatus = ({ status, size }: { status: string; size: string }) => {
  return (
    <div
      className={clsx(
        "flex max-w-16 items-center justify-center rounded-full text-xs font-medium text-white",
        {
          "bg-green-500": status === "DONE",
          "bg-yellow-500": status === "TODO",
          "bg-orange-500": status === "DOING",
          "px-0 py-1": size === "small",
          "px-3 py-2": size === "large",
        },
      )}
    >
      {status}
    </div>
  );
};

export default TaskStatus;
