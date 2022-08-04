import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import FormikForm from "./form/FormikForm";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import toast from "react-hot-toast";

type IndexProps = {
  boardId: string | null | undefined;
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: any;
  columns: any;
};

const AddNewTaskModal = ({
  boardId,
  setShowAddTaskModal,
  tasks,
  columns,
}: IndexProps) => {
  type initialValuesProps = {
    title: string;
    description?: string;
    subtasks?: {}[];
    status: number;
    index: number;
  };

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

  const onSubmit = async (values: any, actions: any) => {
    const { setSubmitting, resetForm } = actions;
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
    <Formik
      initialValues={initialValues}
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
