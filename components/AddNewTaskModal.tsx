import { Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import FormikForm from "./form/FormikForm";

type IndexProps = {
  boardId: string | null | undefined;
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: any;
};

const AddNewTaskModal = ({
  boardId,
  setShowAddTaskModal,
  tasks,
}: IndexProps) => {
  type initialValuesProps = {
    title: string;
    description?: string;
    subtasks?: {}[];
    status: number;
    index: number;
  };

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
    status: 0,
    index: 0,
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
          <FormikForm
            boardId={boardId}
            setShowAddTaskModal={setShowAddTaskModal}
            tasks={tasks}
            formik={formik}
          />
        );
      }}
    </Formik>
  );
};

export default AddNewTaskModal;
