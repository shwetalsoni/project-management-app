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
      <div className="flex flex-col gap-4 bg-white p-10">
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
            <Form className="form-control flex flex-col items-center">
              <div className="flex w-full flex-col rounded-xl sm:max-w-[480px] md:max-w-[540px] ">
                <div className="relative mb-5 flex items-center justify-center gap-4">
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
                <div className="bg-slate-50 p-4 md:p-8">
                  <div className="flex flex-col">
                    <label
                      className="text-md label text-left text-gray-700"
                      htmlFor="title"
                    >
                      Title
                    </label>
                    <Field
                      required
                      id="title"
                      name="title"
                      placeholder="Title"
                      value={values.title}
                      className="input input-bordered mb-3 w-full bg-white text-gray-700 placeholder:text-sm"
                    />
                  </div>
                  <label className="form-control">
                    <div className="label">
                      <span className="text-md label-text text-gray-800">
                        Description
                      </span>
                    </div>
                    <textarea
                      required
                      className="textarea textarea-bordered mb-3 h-24 w-full bg-white text-gray-700"
                      placeholder="Details of task"
                      onChange={(e) =>
                        setFormValues({
                          ...values,
                          description: e.target.value,
                        })
                      }
                      value={values.description}
                    />
                  </label>
                </div>
              </div>
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
      </div>
    </>
  );
};

export default CreateProject;
