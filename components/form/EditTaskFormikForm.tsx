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
import { useContext, useState } from "react";
import { UserContext } from "../../lib/context";
import toast from "react-hot-toast";
import { Checkbox } from "@mantine/core";

type IndexProps = {
  boardId: string | null | undefined;
  taskId: string | null | undefined;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormikForm = ({ boardId, taskId, setShowEditTaskModal }: IndexProps) => {
  const user = useContext(UserContext);

  const [checked, setChecked] = useState(false);

  const dropdownOptions = [
    // "value: ''" will automatically make this option invalid and throw an error
    { key: "Select an option", value: "" },
    { key: "TODO", value: "todo" },
    { key: "DOING", value: "doing" },
    { key: "DONE", value: "done" },
  ];
  const formik = useFormikContext();
  const { values, setSubmitting, resetForm }: any = formik;

  const handleSubmit = async () => {
    setSubmitting(true);
    const uid = uuidv4();
    const taskDocRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${taskId}`,
      "tasks",
      uid
    );

    await setDoc(taskDocRef, {
      // Using type guard to ensure that we're always spreading an object
      ...(typeof values === "object" ? values : {}),
      uid: uid,
      updatedAt: Timestamp.fromDate(new Date()),
    });
    toast.success("New Task Created");
    setSubmitting(false);
    resetForm();
    setShowEditTaskModal(false);
  };

  return (
    <>
      {values && (
        <section className="absolute bg-black bg-opacity-50 inset-0 w-full h-screen flex justify-center items-center">
          <Form
            onClick={(e) => e.stopPropagation()}
            className="p-6 bg-darkGray rounded-md flex flex-col justify-between gap-8 min-w-[450px]"
          >
            {/* Title */}
            <div>
              <Field
                id="title"
                name="title"
                className="bg-transparent py-2 px-3 outline-0 text-lg font-bold"
              />
              <ErrorMessage
                name="title"
                component="p"
                className="text-red-400"
              />
            </div>
            {/* Description */}
            <div>
              <Field
                as="textarea"
                id="description"
                name="description"
                className="bg-transparent py-2 px-3 outline-0 opacity-60 resize-none"
              />
              <ErrorMessage
                name="description"
                component="p"
                className="text-red-400"
              />
            </div>
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
                      <div key={subtask?.uid} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <div className="flex justify-between bg-darkBlue rounded py-2 px-3 w-full gap-3">
                            <Checkbox
                              checked={checked}
                              onChange={() => {
                                setChecked(!checked);
                              }}
                              aria-label="subtask checkbox"
                            />
                            <Field
                              className="text-fontPrimary bg-darkBlue border-none outline-0 mr-auto"
                              name={`subtasks[${index}].title`}
                              id={`subtasks[${index}].title`}
                              type="text"
                            />
                          </div>
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
