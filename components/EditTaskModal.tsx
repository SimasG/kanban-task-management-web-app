import { Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import EditTaskFormikForm from "./form/EditTaskFormikForm";
import { useContext, useEffect, useState } from "react";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserContext } from "../lib/context";
import toast from "react-hot-toast";

type IndexProps = {
  boardId: string | null | undefined;
  taskId: string | null | undefined;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: any;
  columns: any;
  sharedBoardIds: any;
  users: any;
};

const EditTaskModal = ({
  boardId,
  taskId,
  setShowEditTaskModal,
  tasks,
  columns,
  sharedBoardIds,
  users,
}: IndexProps) => {
  const user = useContext(UserContext);
  const [data, setData] = useState<any>();

  const selectedTask = tasks?.filter((task: any) => task?.uid === taskId)?.[0];

  type initialValuesProps = {
    title: string;
    description?: string;
    subtasks?: {}[];
    status: number | undefined;
    index: number | undefined;
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
        checked: false,
      },
    ],
    status: undefined,
    index: undefined,
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
    const { setSubmitting, resetForm } = actions;
    // Why do I have to convert "values.status" to number? I thought it's supposed to be a number by default
    updateTask(values, setSubmitting, resetForm);
  };

  const updateTask = async (
    values: any,
    setSubmitting: any,
    resetForm: any
  ) => {
    setSubmitting(true);
    let taskDocRef: any;

    if (sharedBoardIds.includes(boardId)) {
      // Edit Task in shared Board

      // Finding Current User (Invitee) Firebase Doc
      const currentUser = users?.find(
        (currentUser: any) => currentUser.uid === user?.uid
      );
      // Find User Id (Inviter) of the Shared Board
      const sharedBoardRef = currentUser?.sharedBoardRefs?.find(
        (board: any) => board?.board === boardId
      );
      taskDocRef = doc(
        db,
        "users",
        `${sharedBoardRef?.user}`,
        "tasks",
        `${taskId}`
      );
    } else {
      // Edit Task in personal Board
      taskDocRef = doc(db, "users", `${user?.uid}`, "tasks", `${taskId}`);
    }

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
            sharedBoardIds={sharedBoardIds}
            users={users}
          />
        );
      }}
    </Formik>
  );
};

export default EditTaskModal;
