import { Formik, FormikHelpers, FormikState } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import EditTaskFormikForm from "./form/EditTaskFormikForm";
import { useContext, useEffect, useState } from "react";
import {
  doc,
  DocumentData,
  DocumentReference,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserContext } from "../lib/context";
import toast from "react-hot-toast";
import {
  ColumnSchema,
  FormikValuesSchema,
  initialValuesProps,
  SharedBoardRef,
  TaskSchema,
  UserSchema,
} from "../lib/types";

type IndexProps = {
  activeBoardId: string | null | undefined;
  taskId: string | null | undefined;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: TaskSchema[] | undefined;
  columns: ColumnSchema[] | undefined;
  sharedBoardIds: (string | null | undefined)[];
  users: UserSchema[];
};

const EditTaskModal = ({
  activeBoardId,
  taskId,
  setShowEditTaskModal,
  tasks,
  columns,
  sharedBoardIds,
  users,
}: IndexProps) => {
  const user = useContext(UserContext);
  const [data, setData] = useState<TaskSchema>();

  const selectedTask = tasks?.find((task: TaskSchema) => task?.uid === taskId);

  // Populating the state with the selected Task data
  useEffect(() => {
    if (!selectedTask) return;
    setData({
      ...selectedTask,
    });
  }, [selectedTask]);

  const initialValues: initialValuesProps = {
    // **    title: data.title || "" <- look into this way of setting values
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

  const onSubmit = (
    values: initialValuesProps,
    actions: FormikHelpers<initialValuesProps>
  ) => {
    const { setSubmitting, resetForm } = actions;

    // Why do I have to convert "values.status" to number? I thought it's supposed to be a number by default
    updateTask(values, setSubmitting, resetForm);
  };

  const updateTask = async (
    values: initialValuesProps,
    setSubmitting: (isSubmitting: boolean) => void, // *TypeScript* Would like to specify type once "actions" type is specified
    resetForm: (
      nextState?: Partial<FormikState<initialValuesProps>> | undefined
    ) => void // *TypeScript* Would like to specify type once "actions" type is specified
  ) => {
    setSubmitting(true);
    let taskDocRef: DocumentReference<DocumentData>;

    if (sharedBoardIds.includes(activeBoardId)) {
      // Edit Task in shared Board

      // Finding Current User (Invitee) Firebase Doc
      const currentUser = users?.find(
        (currentUser: UserSchema) => currentUser?.uid === user?.uid
      );
      // Find User Id (Inviter) of the Shared Board
      const sharedBoardRef = currentUser?.sharedBoardRefs?.find(
        (sharedBoardRef: SharedBoardRef) =>
          sharedBoardRef?.board === activeBoardId
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
      status: parseInt(values?.status || ""),
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
            activeBoardId={activeBoardId}
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
