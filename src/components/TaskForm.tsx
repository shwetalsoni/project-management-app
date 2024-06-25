import { Field, Form, Formik } from "formik";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useRouter } from "next/router";

export type FormValues = {
  title: string;
  description: string;
  tags: string[];
  deadline: Date;
  assigneeId: string;
};

const TaskForm = ({
  header,
  _formValues,
  onSubmit,
  projectId,
}: {
  header: string;
  _formValues?: FormValues;
  onSubmit: (values: FormValues) => Promise<void>;
  projectId: number;
}) => {
  const router = useRouter();

  const [formValues, setFormValues] = useState<FormValues>(
    _formValues ?? {
      title: "",
      description: "",
      tags: [],
      deadline: new Date(),
      assigneeId: "",
    },
  );

  useEffect(() => {
    if (_formValues) setFormValues(_formValues);
  }, [_formValues]);

  const [currentTag, setCurrentTag] = useState<string>("");

  const { data: members } = api.projects.getMember.useQuery(
    { id: projectId },
    { enabled: !!projectId },
  );

  return (
    <div className="flex flex-col gap-4 bg-white p-10">
      <Formik
        enableReinitialize
        initialValues={formValues}
        onSubmit={() =>
          onSubmit({
            ...formValues,
            assigneeId: formValues.assigneeId,
          })
        }
      >
        {({ values }) => {
          console.log(values);
          return (
            <Form className="form-control flex flex-col items-center">
              <div className="flex w-full flex-col rounded-xl sm:max-w-[480px] md:max-w-[540px] ">
                <div className="relative mb-5 flex w-full items-center justify-center gap-4">
                  <div
                    onClick={() => router.back()}
                    className="absolute left-0 cursor-pointer"
                  >
                    <MdOutlineKeyboardBackspace size={30} color="black" />
                  </div>
                  <h1 className="text-center text-xl font-medium text-gray-800">
                    {header}
                  </h1>
                </div>

                <div className="bg-slate-50 p-4 md:p-8">
                  <label
                    className="text-md label text-gray-700"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <Field
                    id="title"
                    name="title"
                    placeholder="Title"
                    value={values.title}
                    className="input input-bordered mb-3 w-full bg-white text-gray-700 placeholder:text-sm"
                  />

                  <div className="label">
                    <span className="text-md label-text text-gray-800">
                      Description
                    </span>
                  </div>
                  <textarea
                    className="textarea textarea-bordered mb-3 h-24 w-full bg-white text-gray-700"
                    placeholder="Details of task"
                    value={values.description}
                    onChange={(e) =>
                      setFormValues({ ...values, description: e.target.value })
                    }
                  ></textarea>

                  <label className="label text-gray-700" htmlFor="deadline">
                    Due date
                  </label>
                  <DatePicker
                    onChange={(date) =>
                      setFormValues({ ...values, deadline: date as Date })
                    }
                    value={values.deadline}
                    className="mb-4 w-full"
                  />

                  <label className="label text-gray-700" htmlFor="description">
                    Assignee
                  </label>
                  <select
                    onChange={(e) => {
                      setFormValues({ ...values, assigneeId: e.target.value });
                    }}
                    className="select select-bordered mb-4 bg-white"
                  >
                    <option value={""} selected={!formValues.assigneeId}>
                      Not Assigned
                    </option>
                    {members?.map((member) => (
                      <option
                        key={member.id}
                        value={member.id}
                        selected={
                          !!values.assigneeId ?? values.assigneeId === member.id
                        }
                      >
                        {member.username}
                      </option>
                    ))}
                  </select>

                  <label
                    className="label mb-1 text-gray-700"
                    htmlFor="tags-custom"
                  >
                    Tags
                  </label>
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    {values.tags.length > 0 &&
                      values.tags.map((tag, index) => (
                        <div key={index}>
                          <div
                            id="tag"
                            className="flex gap-1 rounded-full bg-cyan-500 px-2 py-1 text-sm text-white"
                          >
                            <p>{tag}</p>
                            <button
                              type="button"
                              className="secondary text-xs"
                              onClick={() =>
                                setFormValues({
                                  ...values,
                                  tags: values.tags.filter(
                                    (_, i) => i !== index,
                                  ),
                                })
                              }
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className=" flex flex-col items-start">
                    <input
                      className="input input-bordered mb-3 w-full bg-white text-gray-700 placeholder:text-sm"
                      placeholder="Enter tag"
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setFormValues({
                          ...values,
                          tags: [...values.tags, currentTag],
                        });
                        setCurrentTag("");
                      }}
                    >
                      + Add Tags
                    </button>
                  </div>

                  <button
                    className="btn mt-5 border-0 bg-cyan-800 text-white"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default TaskForm;
