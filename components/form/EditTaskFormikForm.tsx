import { ErrorMessage, Field, FieldArray, Form } from "formik";
import FormikControl from "./FormikControl";
import { v4 as uuidv4 } from "uuid";
import {
  doc,
  increment,
  runTransaction,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../../lib/context";
import toast from "react-hot-toast";
import { Checkbox } from "@mantine/core";

type IndexProps = {
  boardId: string | null | undefined;
  taskId: string | null | undefined;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: any;
  formik: any;
  columns: any;
};

const FormikForm = ({
  boardId,
  taskId,
  setShowEditTaskModal,
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

  const { initialValues, values, setSubmitting, resetForm }: any = formik;

  // Identifying source Column id, from which the Task should be removed
  const sourceColumn = columns?.find(
    (column: any) => column?.status === parseInt(initialValues?.status)
  );

  // Identifying destination Column id, to which the Task should be added
  const destinationColumn = columns?.find(
    (column: any) => column?.status === parseInt(values?.status)
  );

  const handleSubmit = async () => {
    // Why do I have to convert "values.status" to number? I thought it's supposed to be a number by default
    if (initialValues?.status === parseInt(values?.status)) {
      softUpdateTask();
    } else {
      // ** Like with DnD between Columns, if I change status, I need to do a transaction (Read, Write, Delete)
      hardUpdateTask();
    }
  };

  // U (no status changes)
  const softUpdateTask = async () => {
    setSubmitting(true);

    const taskDocRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${boardId}`,
      "columns",
      `${sourceColumn?.uid}`,
      "tasks",
      `${taskId}`
    );

    await updateDoc(taskDocRef, {
      // Using type guard to ensure that we're always spreading an object
      ...(typeof values === "object" ? values : {}),
      // Otherwise, status will be stored as an string
      status: parseInt(values?.status),
      updatedAt: Timestamp.fromDate(new Date()),
    });

    toast.success("Task Updated");
    setSubmitting(false);
    resetForm();
    setShowEditTaskModal(false);
  };

  // CRUD (status changes included)
  const hardUpdateTask = async () => {
    setSubmitting(true);
    try {
      await runTransaction(db, async (transaction) => {
        // ** Handling affected Task
        const taskDocRef = doc(
          db,
          "users",
          `${user?.uid}`,
          "boards",
          `${boardId}`,
          "columns",
          `${sourceColumn?.uid}`,
          "tasks",
          `${taskId}`
        );
        // READ
        const affectedTaskRaw = await transaction.get(taskDocRef);
        if (!affectedTaskRaw.exists()) {
          throw "Task does not exist!";
        }
        const affectedTask = affectedTaskRaw.data();

        const newTaskDocRef = doc(
          db,
          "users",
          `${user?.uid}`,
          "boards",
          `${boardId}`,
          "columns",
          `${destinationColumn?.uid}`,
          "tasks",
          `${taskId}`
        );

        const destinationTasks = tasks?.filter(
          (task: any) => task?.status === parseInt(values?.status)
        );

        // CREATE
        transaction.set(newTaskDocRef, {
          ...(typeof affectedTask === "object" ? affectedTask : {}),
          status: parseInt(values?.status),
          index: destinationTasks?.length,
          updatedAt: Timestamp.fromDate(new Date()),
        });

        // DELETE
        transaction.delete(taskDocRef);

        // ** Handling affected Column
        // Decrement Tasks that came after the affected Task in the affected Column
        const sourceColumnTasks = tasks?.filter(
          (task: any) => task?.status === initialValues?.status
        );

        sourceColumnTasks?.map((task: any) => {
          if (task?.index >= affectedTask?.index) {
            if (task?.uid === affectedTask?.uid) return;
            console.log("task that will be decremented:", task);
            const taskDocRef = doc(
              db,
              "users",
              `${user?.uid}`,
              "boards",
              `${boardId}`,
              "columns",
              `${sourceColumn?.uid}`,
              "tasks",
              `${task?.uid}`
            );
            transaction.update(taskDocRef, { index: increment(-1) });
          }
        });
      });
      toast.success("Task Updated");
      setSubmitting(false);
      resetForm();
      setShowEditTaskModal(false);
    } catch (err) {
      console.log("transaction failed:", err);
    }
  };

  const deleteTask = async () => {
    const batch = writeBatch(db);

    const selectedColumnTasks = tasks?.filter(
      (task: any) => task?.status === initialValues?.status
    );

    // Delete chosen Task
    const taskRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${boardId}`,
      "columns",
      `${sourceColumn?.uid}`,
      "tasks",
      `${taskId}`
    );
    batch.delete(taskRef);

    // Decrement indexes of Tasks that came after the deleted Task
    selectedColumnTasks.map((task: any) => {
      if (task?.index <= initialValues?.index) return;
      console.log(
        `task to be decremented in Column: ${initialValues?.status}:`,
        task
      );
      const taskDocRef = doc(
        db,
        "users",
        `${user?.uid}`,
        "boards",
        `${boardId}`,
        "columns",
        `${sourceColumn?.uid}`,
        "tasks",
        `${task?.uid}`
      );
      batch.update(taskDocRef, { index: increment(-1) });
    });

    await batch.commit();
    setShowEditTaskModal(false);
    toast.success("Task has been deleted!");
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
            <div className="flex justify-between items-center">
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
              {/* Delete Task Btn */}
              <svg
                className="w-16 h-12 p-2 text-fontSecondary rounded cursor-pointer hover:bg-darkBlue"
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
                className="bg-transparent py-2 px-3 outline-0 opacity-60 resize-none w-full h-24"
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
                    {subtasks.map((subtask: any, index: number) => {
                      return (
                        <div key={subtask?.uid} className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <div className="flex justify-between bg-darkBlue rounded py-2 px-3 w-full gap-3">
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
                                    ? "text-fontPrimary bg-darkBlue border-none outline-0 w-full line-through opacity-60"
                                    : "text-fontPrimary bg-darkBlue border-none outline-0 w-full"
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
                            className="text-red-400"
                          />
                        </div>
                      );
                    })}
                    {/* Add Subtask Btn */}
                    <button
                      type="button"
                      className="whiteBtn text-sm"
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
            <button
              type="submit"
              className="purpleBtn"
              onClick={() => handleSubmit()}
            >
              Edit Task
            </button>
          </Form>
        </section>
      )}
    </>
  );
};

export default FormikForm;
