import { ErrorMessage, Field, FieldArray, Form, FormikValues } from "formik";
import FormikControl from "./FormikControl";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../../lib/context";
import toast from "react-hot-toast";

type IndexProps = {
  boardId: string | null | undefined;
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: any;
  formik: any;
  columns: any;
};

const FormikForm = ({
  boardId,
  setShowAddTaskModal,
  tasks,
  formik,
  columns,
}: IndexProps) => {
  const user = useContext(UserContext);

  // "value: ''" will automatically make this option invalid (falsy value) and throw an error
  let dropdownOptions: any = [{ key: "Select an option", value: "" }];
  columns?.map((column: any) => {
    dropdownOptions.push({
      key: `${column?.title.toUpperCase()}`,
      value: `${column?.status}`,
    });
  });

  // ** Why is formik automatically storing values.status & values.index as strings and not numbers?
  const { values, setSubmitting, resetForm }: any = formik;

  const handleSubmit = async () => {
    setSubmitting(true);

    // Identifying Column id, to which the Task should be added.
    const selectedColumn = columns?.find(
      (column: any) => column?.status === parseInt(values?.status)
    );

    const uid = uuidv4();
    const taskDocRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${boardId}`,
      "columns",
      `${selectedColumn?.uid}`,
      "tasks",
      `${uid}`
    );

    const chosenColumnTasks = tasks?.filter(
      (task: any) => task?.status === parseInt(values?.status)
    );

    await setDoc(taskDocRef, {
      // Using type guard to ensure that we're always spreading an object
      ...(typeof values === "object" ? values : {}),
      index: parseInt(chosenColumnTasks?.length),
      status: parseInt(values?.status),
      boardId: boardId,
      uid: uid,
      createdAt: Timestamp.fromDate(new Date()),
    });

    toast.success("New Task Created");
    setSubmitting(false);
    resetForm();
    setShowAddTaskModal(false);
  };

  return (
    <>
      {/* Still confused why I have to render the component once the values are declared */}
      {values && (
        <section className="absolute bg-black bg-opacity-50 inset-0 w-full h-screen flex justify-center items-center">
          <Form
            onClick={(e) => e.stopPropagation()}
            className="p-6 bg-backgroundColorMenu dark:bg-darkGray rounded-md flex flex-col justify-between gap-8 min-w-[450px]"
          >
            <h2 className="text-fontPrimary dark:text-fontPrimaryDark text-lg font-bold">
              Add New Task
            </h2>
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
              className="resize-none "
            />
            {/* Subtask Container */}
            <FieldArray name="subtasks">
              {(fieldArrayProps) => {
                const { push, remove, form } = fieldArrayProps;
                const { values, handleChange, errors } = form;
                const { subtasks } = values;
                return (
                  <div className="flex flex-col justify-between gap-3">
                    <label
                      className="font-bold text-sm text-fontPrimary dark:text-fontPrimaryDark"
                      htmlFor="subtasks"
                    >
                      Subtasks
                    </label>
                    {subtasks.map((subtask: any, index: number) => (
                      <div key={subtask?.uid} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <Field
                            className="input w-full"
                            name={`subtasks[${index}].title`}
                            id={`subtasks[${index}].title`}
                            placeholder="e.g. Prepare Marketing Campaign Overview"
                            type="text"
                          />
                          {/* Delete Subtask Btn */}
                          <button type="button" onClick={() => remove(index)}>
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
                        <ErrorMessage
                          name={`subtasks[${index}].title`}
                          component="p"
                          className="text-red-400 font-medium"
                        />
                      </div>
                    ))}
                    {/* Add Subtask Btn */}
                    <button
                      type="button"
                      className="purpleBtn dark:whiteBtn text-sm"
                      onClick={() =>
                        push({
                          uid: uuidv4(),
                          title: "",
                          checked: false,
                        })
                      }
                    >
                      + Add New Subtask
                    </button>
                  </div>
                );
              }}
            </FieldArray>
            {/* Status */}
            <FormikControl
              control="select"
              label="Status"
              name="status"
              placeholder="todo"
              options={dropdownOptions}
            />
            {/* Create Task Btn */}
            <button
              type="submit"
              className="purpleBtn"
              onClick={() => handleSubmit()}
            >
              Create Task
            </button>
          </Form>
        </section>
      )}
    </>
  );
};

export default FormikForm;
