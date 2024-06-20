import Head from "next/head";
import SignOut from "@/components/SignOut";

const ProjectDetails = () => {
  return (
    <>
      <Head>
        <title>Project details page</title>
        <meta
          name="description"
          content="Shows all tasks created within a project with other project details"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" justify-left flex min-h-screen flex-col bg-white px-28 py-16">
        <div className="mb-10 flex items-center">
          <h1 className="flex-1 text-2xl font-medium">Tasks</h1>
          <button className="mr-5 rounded-full bg-cyan-700 px-5 py-2 text-white">
            Add Task
          </button>
          <SignOut />
        </div>
        {/* show created projects */}

        <div className="overflow-x-auto">
          <table className="table">
            <thead className="text-gray-500 ">
              <tr className="border-gray-400">
                <th>Title</th>
                <th>Description</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <tr
                  className="cursor-pointer border-gray-200 p-4 hover:bg-cyan-200 hover:bg-opacity-20"
                  key={i}
                  onClick={() =>
                    document.getElementById("my_modal_2").showModal()
                  }
                >
                  <td>Create dashboard UI</td>
                  <td className="truncate text-ellipsis">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Ea, nostrum? Suscipit dicta deserunt hic blanditiis sunt,
                    alias accusantium eius dignissimos quos adipisci, dolorum
                    iusto libero dolore officia. Deserunt, molestiae voluptatum?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Ea, nostrum? Suscipit dicta deserunt hic blanditiis sunt,
                    alias accusantium eius dignissimos quos adipisci, dolorum
                    iusto libero dolore officia. Deserunt, molestiae voluptatum?
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box bg-white text-gray-800">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 ">
                  ✕
                </button>
              </form>
              <h3 className="text-lg font-bold text-gray-700">Title</h3>
              <p className="text-sm text-gray-700">Deadline: 29/06/2024</p>
              <p className="py-4 text-sm text-gray-600">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum
                quisquam perferendis eos placeat nam alias eveniet asperiores
                eligendi deserunt, quo nemo rerum odit molestias necessitatibus
                recusandae tempora quidem quaerat inventore.
              </p>
              <p className="mb-4 text-sm italic text-gray-700">
                Assigned to: Shwetal soni
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center rounded-full bg-cyan-500 px-2 py-1 text-xs text-white">
                  API design
                </div>
                <div className="flex items-center rounded-full bg-cyan-500 p-2 px-2 py-1 text-xs text-white">
                  Database design
                </div>
                <div className="flex items-center rounded-full bg-cyan-500 p-2 px-2 py-1 text-xs text-white">
                  Architecture design
                </div>
                <div className="flex items-center rounded-full bg-cyan-500 p-2 px-2 py-1 text-xs text-white">
                  Frontend
                </div>
                <div className="flex items-center rounded-full bg-cyan-500 p-2 px-2 py-1 text-xs text-white">
                  Integration
                </div>
                <div className="flex items-center rounded-full bg-cyan-500 p-2 px-2 py-1 text-xs text-white">
                  UI
                </div>
              </div>
            </div>
          </dialog>
        </div>
      </main>
    </>
  );
};

export default ProjectDetails;
