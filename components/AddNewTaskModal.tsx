import { Formik, FormikHelpers } from "formik";
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
  FormikValuesSchema,
  initialValuesProps,
  SharedBoardRef,
  TaskSchema,
  UserSchema,
} from "../lib/types";

type IndexProps = {
  activeBoardId: string | null | undefined;
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: TaskSchema[];
  columns: ColumnSchema[] | undefined;
  sharedBoardIds: (string | null | undefined)[];
  users: UserSchema[];
};

const AddNewTaskModal = ({
  activeBoardId,
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
    status: undefined, // *TypeScript* Not too happy with the "undefined" default value | Probably change it to an empty string
    index: undefined, // *TypeScript* Not too happy with the "undefined" default value | This should not be here because it's not a user input
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
  const onSubmit = async (
    values: initialValuesProps,
    actions: FormikHelpers<initialValuesProps>
  ) => {
    // *TypeScript* How do I get the "actions" type? It's fat and formik should provide it (they say they're TS-friendly)
    const { setSubmitting, resetForm } = actions;

    setSubmitting(true);
    // Identifying Column id, to which the Task should be added.
    const selectedColumn = columns?.find(
      (column: ColumnSchema) =>
        column?.status === parseInt(values?.status || "") // *TypeScript* Why does the status type has to be just "string" instead of "string | number"?
    );

    const uid = uuidv4();
    let taskDocRef: DocumentReference<DocumentData>;

    if (sharedBoardIds.includes(activeBoardId)) {
      // Add New Task in shared Board

      // Finding Current User (Invitee) Firebase Doc
      const currentUser = users?.find(
        (currentUser: UserSchema) => currentUser?.uid === user?.uid
      );
      // Find User Id (Inviter) of the Shared Board
      const sharedBoardRef = currentUser?.sharedBoardRefs?.find(
        (boardRef: SharedBoardRef) => boardRef?.board === activeBoardId
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
      (task: TaskSchema) => task?.status === parseInt(values?.status || "")
    );

    await setDoc(taskDocRef, {
      // Using type guard to ensure that we're always spreading an object
      ...(typeof values === "object" ? values : {}),
      index: chosenColumnTasks?.length,
      status: parseInt(values?.status || ""),
      uid: uid,
      createdAt: Timestamp.fromDate(new Date()),
      board: activeBoardId,
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
