import { Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import FormikForm from "./form/FormikForm";

const AddNewTaskModal = () => {
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

  const onSubmit = (values: any) => console.log("Form submitted!", values);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return <FormikForm />;
      }}
    </Formik>
  );
};

export default AddNewTaskModal;
