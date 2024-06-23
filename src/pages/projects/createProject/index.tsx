import Head from "next/head";
import { Field, Form, Formik } from "formik";
import { api } from "@/utils/api";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

interface FormValues {
  title: string;
  description: string;
}

const CreateProject = () => {
  const router = useRouter();

  const [formValues, setFormValues] = useState<FormValues>({
    title: "",
    description: "",
  });

  const createProject = api.projects.create.useMutation();

  return (
    <>
      <Head>
        <title>Create project page</title>
        <meta name="description" content="Create project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col gap-4 bg-white px-96 py-10">
        <div className="relative mb-5 flex w-full items-center justify-center gap-4">
          <div
            onClick={() => router.back()}
            className="absolute left-0 cursor-pointer"
          >
            <MdOutlineKeyboardBackspace size={30} color="black" />
          </div>
          <h1 className="text-center text-xl font-medium text-gray-800">
            Create Project
          </h1>
        </div>

        <Formik
          enableReinitialize
          initialValues={formValues}
          onSubmit={async (values: FormValues) => {
            const toastId = toast("creating project", { isLoading: true });

            const newProject = await createProject
              .mutateAsync(values)
              .catch(() => {
                toast.update(toastId, {
                  render: "Error occured",
                  isLoading: false,
                  type: "error",
                  autoClose: 5000,
                });
              });
            if (!newProject) return;

            toast.update(toastId, {
              render: "Project created successfully",
              isLoading: false,
              type: "success",
              autoClose: 5000,
            });
            void router.push(`/projects/${newProject.data.project.id}`);
          }}
        >
          {({ values }) => (
            <Form className="form-control flex w-full flex-col items-start rounded-xl bg-slate-100 p-5 px-40">
              <label className="text-md label text-gray-700" htmlFor="title">
                Title
              </label>
              <Field
                required
                id="title"
                name="title"
                placeholder="Title"
                value={values.title}
                className="input input-bordered mb-3 w-72 bg-white text-gray-700 placeholder:text-sm sm:w-96"
              />

              <label className="form-control">
                <div className="label">
                  <span className="text-md label-text text-gray-800">
                    Description
                  </span>
                </div>
                <textarea
                  required
                  className="textarea textarea-bordered mb-3 h-24 w-72 bg-white text-gray-700 sm:w-96"
                  placeholder="Details of task"
                  onChange={(e) =>
                    setFormValues({ ...values, description: e.target.value })
                  }
                  value={values.description}
                />
              </label>

              <button
                className="btn mt-5 border-0 bg-cyan-800 text-white"
                type="submit"
                disabled={createProject.isPending}
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </main>
    </>
  );
};

export default CreateProject;
