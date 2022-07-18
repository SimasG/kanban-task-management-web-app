import { Checkbox } from "@mantine/core";
import { deleteDoc, doc } from "firebase/firestore";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../lib/context";
import { db } from "../../lib/firebase";
import useFetchFsTasks from "../../lib/hooks/useFetchFsTasks";

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
  const user = useContext(UserContext);

  // Fetching all Tasks of selected Board
  const tasks = useFetchFsTasks(user?.uid, boardId);

  const selectedTask = tasks?.filter((task: any) => task?.uid === taskId)?.[0];

  const [checked, setChecked] = useState(false);

  return (
    <section className="absolute bg-black bg-opacity-50 inset-0 w-full h-screen flex justify-center items-center">
      <form
        onClick={(e) => e.stopPropagation()}
        className="p-6 bg-darkGray rounded-md flex flex-col justify-between gap-8 min-w-[450px] max-w-[450px]"
      >
        {/* Title */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{selectedTask?.title}</h2>
          {/* Delete Task Btn */}
          <svg
            className="w-16 h-12 p-2 text-fontSecondary rounded cursor-pointer hover:bg-darkBlue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={async () => {
              const taskRef = doc(
                db,
                "users",
                `${user?.uid}`,
                "boards",
                `${boardId}`,
                "tasks",
                `${taskId}`
              );
              await deleteDoc(taskRef);
              setShowEditTaskModal(false);
              toast.success("Task has been deleted!");
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </div>
        {/* Description */}
        <p className="text-fontSecondary text-sm leading-7">
          {selectedTask?.description}
        </p>
        {/* Subtasks */}
        <div className="flex flex-col justify-between gap-2">
          <h2 className="font-bold text-sm mb-2">Subtasks (2 out of 3)</h2>
          {selectedTask?.subtasks.map((subtask: any) => {
            return (
              <div className="subtask" key={subtask?.uid}>
                <Checkbox
                  checked={checked}
                  onChange={() => {
                    setChecked(!checked);
                  }}
                  aria-label="subtask checkbox"
                />
                <span className="text-fontPrimary">{subtask?.title}</span>
              </div>
            );
          })}
        </div>
        {/* Status */}
        <div className="flex flex-col justify-between gap-2">
          <span className="font-bold text-sm">Status</span>
          {/* **Change to select input later */}
          <input
            className="input"
            type="select"
            placeholder="e.g. This will be a select input"
          />
        </div>
        {/* Create Task Btn */}
        <button className="purpleBtn">Edit Task</button>
      </form>
    </section>
  );
};

export default EditTaskModal;
