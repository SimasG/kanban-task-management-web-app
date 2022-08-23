import { ErrorMessage, Field, FieldArray, Form, FormikProps } from "formik";
import FormikControl from "./FormikControl";
import { v4 as uuidv4 } from "uuid";
import { doc, increment, writeBatch } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../../lib/context";
import toast from "react-hot-toast";
import { Checkbox } from "@mantine/core";
import {
  ColumnSchema,
  initialValuesProps,
  SharedBoardRef,
  SubtaskSchema,
  TaskSchema,
  UserSchema,
} from "../../lib/types";

type IndexProps = {
  activeBoardId: string | null | undefined;
  taskId: string | null | undefined;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: TaskSchema[];
  formik: FormikProps<initialValuesProps>;
  columns: ColumnSchema[];
  sharedBoardIds: (string | null | undefined)[];
  users: UserSchema[];
};

const FormikForm = ({
  activeBoardId,
  taskId,
  setShowEditTaskModal,
  tasks,
  formik,
  columns,
  sharedBoardIds,
  users,
}: IndexProps) => {
  const user = useContext(UserContext);

  // "value: ''" will automatically make this option invalid (falsy value) and throw an error
  let dropdownOptions: { key: string; value: string }[] = [
    { key: "Select an option", value: "" },
  ];
  columns?.map((column: ColumnSchema) => {
    dropdownOptions.push({
      key: `${column?.title.toUpperCase()}`,
      value: `${column?.status}`,
    });
  });

  const { initialValues, values } = formik;

  // Identifying source Column id, from which the Task should be removed
  const sourceColumn = columns?.find(
    (column: ColumnSchema) => column?.status === parseInt(initialValues?.status)
  );

  const deleteTask = async () => {
    const batch = writeBatch(db);

    const selectedColumnTasks = tasks?.filter(
      (task: TaskSchema) => task?.status === initialValues?.status
    );

    if (sharedBoardIds.includes(activeBoardId)) {
      // Delete Task in shared Board

      // Finding Current User (Invitee) Firebase Doc
      const currentUser = users?.find(
        (currentUser: UserSchema) => currentUser.uid === user?.uid
      );
      // Find User Id (Inviter) of the Shared Board
      const sharedBoardRef = currentUser?.sharedBoardRefs?.find(
        (sharedBoardRef: SharedBoardRef) =>
          sharedBoardRef?.board === activeBoardId
      );

      // Delete chosen Task
      const taskRef = doc(
        db,
        "users",
        `${sharedBoardRef?.user}`,
        "tasks",
        `${taskId}`
      );
      batch.delete(taskRef);

      // Decrement indexes of Tasks that came after the deleted Task
      selectedColumnTasks.map((task: TaskSchema) => {
        if (task?.index <= initialValues?.index) return;
        const taskDocRef = doc(
          db,
          "users",
          `${sharedBoardRef?.user}`,
          "tasks",
          `${task?.uid}`
        );
        batch.update(taskDocRef, { index: increment(-1) });
      });
    } else {
      // Delete Task in personal Board

      // Delete chosen Task
      const taskRef = doc(db, "users", `${user?.uid}`, "tasks", `${taskId}`);
      batch.delete(taskRef);

      // Decrement indexes of Tasks that came after the deleted Task
      selectedColumnTasks.map((task: TaskSchema) => {
        if (task?.index <= initialValues?.index) return;
        const taskDocRef = doc(
          db,
          "users",
          `${user?.uid}`,
          "tasks",
          `${task?.uid}`
        );
        batch.update(taskDocRef, { index: increment(-1) });
      });
    }

    await batch.commit();
    setShowEditTaskModal(false);
    toast.success("Task has been deleted!");
  };

  return (
    <>
      {values && (
        <section className="absolute bg-black bg-opacity-50 inset-0 w-full h-screen flex justify-center items-center z-[100]">
          <Form
            onClick={(e) => e.stopPropagation()}
            className="p-6 bg-backgroundColorMenu dark:bg-darkGray rounded-md flex flex-col justify-between gap-8 w-[95%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%]"
          >
            {/* Title */}
            <div className="flex justify-between items-center">
              {/* Title */}
              <div>
                <Field
                  id="title"
                  name="title"
                  className="text-fontPrimary dark:text-fontPrimaryDark bg-transparent py-2 px-3 outline-0 text-lg font-bold"
                />
                <ErrorMessage
                  name="title"
                  component="p"
                  className="text-red-400 font-medium"
                />
              </div>
              {/* Delete Task Btn */}
              <svg
                className="w-12 h-12 p-2 text-fontSecondary rounded cursor-pointer hover:bg-backgroundColorMain hover:dark:bg-darkBlue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => deleteTask()}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </div>
            {/* Description */}
            <div>
              <Field
                as="textarea"
                id="description"
                name="description"
                className="bg-transparent py-2 px-3 outline-0 opacity-60 resize-none w-full h-24 text-fontPrimary dark:text-fontPrimaryDark"
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
                const { values, handleChange } = form;
                const { subtasks } = values;
                return (
                  <div className="flex flex-col justify-between gap-3">
                    <label
                      className="font-bold text-sm text-fontPrimary dark:text-fontPrimaryDark"
                      htmlFor="subtasks"
                    >
                      Subtasks
                    </label>
                    {subtasks.map((subtask: SubtaskSchema, index: number) => {
                      return (
                        <div key={subtask?.uid} className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-between bg-backgroundColorMain dark:bg-darkBlue rounded py-2 px-3 w-full gap-3">
                              <Checkbox
                                name={`subtasks[${index}].checked`}
                                id={`subtasks[${index}].checked`}
                                checked={subtask.checked}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                aria-label="subtask checkbox"
                                className="cursor-pointer"
                                radius="xs"
                              />
                              <Field
                                className={
                                  subtask.checked
                                    ? "text-fontPrimary dark:text-fontPrimaryDark bg-backgroundColorMain dark:bg-darkBlue border-none outline-0 w-full line-through opacity-60"
                                    : "text-fontPrimary dark:text-fontPrimaryDark bg-backgroundColorMain dark:bg-darkBlue border-none outline-0 w-full"
                                }
                                name={`subtasks[${index}].title`}
                                id={`subtasks[${index}].title`}
                                type="text"
                                placeholder="e.g. Prepare Marketing Campaign Overview"
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
                            className="text-red-400 font-medium"
                          />
                        </div>
                      );
                    })}
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
              options={dropdownOptions}
            />
            {/* Create Task Btn */}
            <button type="submit" className="purpleBtn">
              Save Changes
            </button>
          </Form>
        </section>
      )}
    </>
  );
};

export default FormikForm;
