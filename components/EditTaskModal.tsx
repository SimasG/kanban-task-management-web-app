import { Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import EditTaskFormikForm from "./form/EditTaskFormikForm";
import { useEffect, useState } from "react";

type IndexProps = {
  boardId: string | null | undefined;
  taskId: string | null | undefined;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: any;
};

const EditTaskModal = ({
  boardId,
  taskId,
  setShowEditTaskModal,
  tasks,
}: IndexProps) => {
  const [data, setData] = useState<any>();

  const selectedTask = tasks?.filter((task: any) => task?.uid === taskId)?.[0];

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
        // checked: []; ?
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

  // Populating the state with the selected Task data
  useEffect(() => {
    if (!selectedTask) return;
    setData({
      ...selectedTask,
    });
  }, [selectedTask]);

  return (
    <Formik
      initialValues={data || initialValues}
      validationSchema={validationSchema}
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
          />
        );
      }}
    </Formik>
  );
};

export default EditTaskModal;
