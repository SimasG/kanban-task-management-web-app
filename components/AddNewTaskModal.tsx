import { Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import FormikForm from "./form/FormikForm";
import {
  doc,
  DocumentData,
  DocumentReference,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import toast from "react-hot-toast";
import {
  ColumnSchema,
  initialValuesProps,
  SharedBoardRef,
  TaskSchema,
  UserSchema,
} from "../lib/types";

type IndexProps = {
  boardId: string | null | undefined;
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: TaskSchema[];
  columns: ColumnSchema[];
  sharedBoardIds: (string | null | undefined)[];
  users: UserSchema[];
};

const AddNewTaskModal = ({
  boardId,
  setShowAddTaskModal,
  tasks,
  columns,
  sharedBoardIds,
  users,
}: IndexProps) => {
  const user = useContext(UserContext);

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
    status: undefined, // *TypeScript* Not too happy with the "undefined" default value
    index: undefined, // *TypeScript* Not too happy with the "undefined" default value
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

  // Add New Task
  const onSubmit = async (values: TaskSchema, actions: any) => {
    // *TypeScript* How do I get the "actions" type? It's fat and formik says it's TS-friendly
    const { setSubmitting, resetForm } = actions;

    setSubmitting(true);
    // Identifying Column id, to which the Task should be added.
    const selectedColumn = columns?.find(
      (column: ColumnSchema) => column?.status === values?.status
    );

    const uid = uuidv4();
    let taskDocRef: DocumentReference<DocumentData>;

    if (sharedBoardIds.includes(boardId)) {
      // Add New Task in shared Board

      // Finding Current User (Invitee) Firebase Doc
      const currentUser = users?.find(
        (currentUser: UserSchema) => currentUser.uid === user?.uid
      );
      // Find User Id (Inviter) of the Shared Board
      const sharedBoardRef = currentUser?.sharedBoardRefs?.find(
        (boardRef: SharedBoardRef) => boardRef?.board === boardId
      );
      taskDocRef = doc(
        db,
        "users",
        `${sharedBoardRef?.user}`,
        "tasks",
        `${uid}`
      );
    } else {
      // Add New Task in personal Board
      taskDocRef = doc(db, "users", `${user?.uid}`, "tasks", `${uid}`);
    }

    const chosenColumnTasks = tasks?.filter(
      (task: TaskSchema) => task?.status === values?.status
    );

    await setDoc(taskDocRef, {
      // Using type guard to ensure that we're always spreading an object
      ...(typeof values === "object" ? values : {}),
      index: chosenColumnTasks?.length,
      status: values?.status,
      uid: uid,
      createdAt: Timestamp.fromDate(new Date()),
      board: boardId,
      column: selectedColumn?.uid,
    });

    toast.success("New Task Created");
    setSubmitting(false);
    resetForm();
    setShowAddTaskModal(false);
  };

  return (
    <Formik
      initialValues={initialValues} // *TypeScript* Pls fix
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <FormikForm
            formik={formik}
            columns={columns}
            setShowAddTaskModal={setShowAddTaskModal}
          />
        );
      }}
    </Formik>
  );
};

export default AddNewTaskModal;
