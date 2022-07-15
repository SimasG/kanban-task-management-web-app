import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  useFormikContext,
} from "formik";
import FormikControl from "./FormikControl";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../../lib/context";

type IndexProps = {
  id: string | null | undefined;
};

const FormikForm = ({ id }: IndexProps) => {
  const user = useContext(UserContext);

  const dropdownOptions = [
    // "value: ''" will automatically make this option invalid and throw an error
    { key: "Select an option", value: "" },
    { key: "TODO", value: "todo" },
    { key: "DOING", value: "doing" },
    { key: "DONE", value: "done" },
  ];
  const formik = useFormikContext();
  const { values, setSubmitting, resetForm } = formik;

  const handleSubmit = async () => {
    console.log("new way to submit the form!");
    setSubmitting(true);
    const taskDocRef = doc(
      db,
      `${user?.uid}`,
      "boards",
      `${id}`,
      "tasks",
      uuidv4()
    );

    await setDoc(taskDocRef, {
      values,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  };

  return (
    <>
      {/* Still confused why I have to render the component once the values are declared */}
      {values && (
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
            <FieldArray name="subtasks">
              {(fieldArrayProps) => {
                const { push, remove, form } = fieldArrayProps;
                const { values, handleChange, errors } = form;
                const { subtasks } = values;
                return (
                  <div className="flex flex-col justify-between gap-3">
                    <label htmlFor="subtasks">Subtasks</label>
                    {subtasks.map((subtask: any, index: number) => (
                      <div key={subtask.uid} className="flex flex-col gap-2">
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
                          className="text-red-400"
                        />
                      </div>
                    ))}
                    {/* Add Subtask Btn */}
                    <button
                      type="button"
                      className="whiteBtn text-sm"
                      onClick={() =>
                        push({
                          uid: uuidv4(),
                          title: "",
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
