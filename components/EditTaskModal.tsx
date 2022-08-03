import { Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import EditTaskFormikForm from "./form/EditTaskFormikForm";
import { useContext, useEffect, useState } from "react";
import {
  doc,
  increment,
  runTransaction,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserContext } from "../lib/context";
import toast from "react-hot-toast";

type IndexProps = {
  boardId: string | null | undefined;
  taskId: string | null | undefined;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: any;
  columns: any;
};

const EditTaskModal = ({
  boardId,
  taskId,
  setShowEditTaskModal,
  tasks,
  columns,
}: IndexProps) => {
  const user = useContext(UserContext);
  const [data, setData] = useState<any>();

  const selectedTask = tasks?.filter((task: any) => task?.uid === taskId)?.[0];

  type initialValuesProps = {
    title: string;
    description?: string;
    subtasks?: {}[];
    status: number;
    index: number;
  };

  // Populating the state with the selected Task data
  useEffect(() => {
    if (!selectedTask) return;
    setData({
      ...selectedTask,
    });
  }, [selectedTask]);

  const initialValues: initialValuesProps = {
    title: "",
    description: "",
    subtasks: [
      {
        uid: uuidv4(),
        title: "",
        // checked: []; ?
        checked: false,
      },
    ],
    status: -1,
    index: -1,
  };

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

  const onSubmit = (values: any, actions: any) => {
    // Identifying source Column id, from which the Task should be removed
    const sourceColumn = columns?.find(
      // ** Not happy with the initialValues -> data workaround here.
      (column: any) => column?.status === parseInt(data?.status)
    );

    // Identifying destination Column id, to which the Task should be added
    const destinationColumn = columns?.find(
      (column: any) => column?.status === parseInt(values?.status)
    );
    const { setSubmitting, resetForm } = actions;
    // Why do I have to convert "values.status" to number? I thought it's supposed to be a number by default
    if (data?.status === parseInt(values?.status)) {
      softUpdateTask(values, setSubmitting, sourceColumn, resetForm);
    } else {
      hardUpdateTask(
        values,
        setSubmitting,
        sourceColumn,
        destinationColumn,
        resetForm
      );
    }
  };

  // U (no status changes)
  const softUpdateTask = async (
    values: any,
    setSubmitting: any,
    sourceColumn: any,
    resetForm: any
  ) => {
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
  const hardUpdateTask = async (
    values: any,
    setSubmitting: any,
    sourceColumn: any,
    destinationColumn: any,
    resetForm: any
  ) => {
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

  return (
    <Formik
      initialValues={data || initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {(formik) => {
        return (
          <EditTaskFormikForm
            boardId={boardId}
            taskId={taskId}
            setShowEditTaskModal={setShowEditTaskModal}
            tasks={tasks}
            formik={formik}
            columns={columns}
          />
        );
      }}
    </Formik>
  );
};

export default EditTaskModal;
