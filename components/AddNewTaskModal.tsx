import { Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import FormikControl from "./form/FormikControl";

const AddNewTaskModal = () => {
  type initialValuesProps = {
    title: string;
    description?: string;
    status: string;
    subtasks?: {}[];
  };

  const initialValues: initialValuesProps = {
    title: "",
    description: "",
    subtasks: [{ title: "" }],
    status: "",
  };

  const dropdownOptions = [
    // "value: ''" will automatically make this option invalid and throw an error
    { key: "Select an option", value: "" },
    { key: "TODO", value: "todo" },
    { key: "DOING", value: "doing" },
    { key: "DONE", value: "done" },
  ];

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is Required!"),
    description: Yup.string().required("Description is Required!"),
    subtasks: Yup.array().of(
      Yup.object({
        title: Yup.string().required("Subtask Title is Required!"),
      })
    ),
    status: Yup.string().required("Status is Required!"),
  });

  const onSubmit = (values: any) => console.log("Submitted bittttttch");

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <section className="absolute bg-black bg-opacity-50 inset-0 w-full h-screen flex justify-center items-center">
          <Form
            onClick={(e) => e.stopPropagation()}
            className="p-6 bg-darkGray rounded-md flex flex-col justify-between gap-8 min-w-[450px]"
          >
            <h2 className="text-lg font-bold">Add New Task</h2>
            {/* Title */}
            <FormikControl
              control="input"
              label="Title"
              name="title"
              placeholder="e.g. Design new homepage"
            />
            {/* Description */}
            <FormikControl
              control="textarea"
              label="Description"
              name="description"
              placeholder="e.g. The homepage of UReason should be redesigned to fit in with the modern web standards. 
              The homepage of UReason should be redesigned to fit in with the modern web standards."
            />
            {/* Subtask Container */}
            <div className="flex flex-col justify-between gap-3">
              <span className="font-bold text-sm">Subtasks</span>
              {/* Individual Subtasks */}
              <div className="flex flex-col justify-between gap-2">
                <div className="flex justify-center items-center gap-2">
                  <input
                    className="input w-full"
                    type="text"
                    placeholder="e.g. Create new Homepage wireframe"
                  />
                  {/* Delete Subtask Btn */}
                  <button>
                    <svg
                      className="w-8 h-8 p-1 text-fontSecondary hover:bg-fontSecondary hover:bg-opacity-25 hover:rounded"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              {/* Add Subtask Btn */}
              <button type="button" className="whiteBtn text-sm">
                + Add New Subtask
              </button>
            </div>
            {/* Status */}
            <FormikControl
              control="select"
              label="Status"
              name="status"
              placeholder="todo"
              options={dropdownOptions}
            />
            {/* Create Task Btn */}
            <button type="submit" className="purpleBtn">
              Create Task
            </button>
          </Form>
        </section>
      )}
    </Formik>
  );
};

export default AddNewTaskModal;
