import { Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import FormikForm from "./form/FormikForm";

type IndexProps = {
  boardId: string | null | undefined;
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddNewTaskModal = ({ boardId, setShowAddTaskModal }: IndexProps) => {
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
        checked: false,
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

  // const onSubmit = async (values: any) => {
  //   console.log("Form submitted!", values);
  //   const ref = doc(db, `${user?.uid}`, "boards", `${id}`, "tasks", uuidv4());
  // };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema}>
      {(formik) => {
        return (
          <FormikForm
            boardId={boardId}
            setShowAddTaskModal={setShowAddTaskModal}
          />
        );
      }}
    </Formik>
  );
};

export default AddNewTaskModal;
