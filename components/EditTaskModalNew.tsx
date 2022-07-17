import { Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import EditTaskFormikForm from "./form/EditTaskFormikForm";
import { doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";

type IndexProps = {
  boardId: string | null | undefined;
  taskId: string | null | undefined;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditTaskModalNew = ({ taskId, setShowEditTaskModal }: IndexProps) => {
  const user = useContext(UserContext);

  type initialValuesProps = {
    title: string;
    description?: string;
    status: string;
    subtasks?: {}[];
  };

  const initialValues: initialValuesProps = {
    title: "",
    description: "",
    subtasks: [
      {
        uid: uuidv4(),
        title: "",
      },
    ],
    status: "",
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

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema}>
      {(formik) => {
        return (
          <EditTaskFormikForm
            taskId={taskId}
            setShowEditTaskModal={setShowEditTaskModal}
          />
        );
      }}
    </Formik>
  );
};

export default EditTaskModalNew;
