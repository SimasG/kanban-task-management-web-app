import { Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import EditTaskFormikForm from "./form/EditTaskFormikForm";
import { doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import useFetchFsTasks from "../lib/hooks/useFetchFsTasks";
import { useSetState } from "@mantine/hooks";
import useFetchTasksCollectionGroup from "../lib/hooks/useFetchTasksCollectionGroup";

type IndexProps = {
  boardId: string | null | undefined;
  taskId: string | null | undefined;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditTaskModal = ({
  boardId,
  taskId,
  setShowEditTaskModal,
}: IndexProps) => {
  const [data, setData] = useState<any>();
  // const user = useContext(UserContext);
  // Fetching all Tasks of selected Board
  // const tasks = useFetchFsTasks(user?.uid, boardId);
  const tasks: any = useFetchTasksCollectionGroup(boardId);

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
          />
        );
      }}
    </Formik>
  );
};

export default EditTaskModal;
