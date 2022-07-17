import { Checkbox } from "@mantine/core";
import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import useFetchFsTasks from "../lib/hooks/useFetchFsTasks";

type IndexProps = {
  boardId: string | null | undefined;
  taskId: string | null | undefined;
};

const EditTaskModal = ({ boardId, taskId }: IndexProps) => {
  const user = useContext(UserContext);

  // Fetching all Tasks of selected Board
  const tasks = useFetchFsTasks(user?.uid, boardId);
  console.log("EditTaskModal Tasks:", tasks);
  console.log("taskId:", taskId);

  // ** Get id of the Task that's been clicked, find that Task, populate the JSX with it

  const [checked, setChecked] = useState(false);

  return (
    <section className="absolute bg-black bg-opacity-50 inset-0 w-full h-screen flex justify-center items-center">
      <form
        onClick={(e) => e.stopPropagation()}
        className="p-6 bg-darkGray rounded-md flex flex-col justify-between gap-8 min-w-[450px] max-w-[450px]"
      >
        {/* Title */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">
            Research pricing points of various competitors and trial different
            business models
          </h2>
          {/* Delete Task Btn */}
          <svg
            className="w-16 h-12 p-2 text-fontSecondary rounded cursor-pointer hover:bg-darkBlue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim commodi
          accusantium fugit quo architecto quas ea maiores, natus quis
          exercitationem est minima dolorem nulla consectetur tenetur
          dignissimos, ipsam asperiores beatae.
        </p>
        {/* Subtasks */}
        <div className="flex flex-col justify-between gap-2">
          <h2 className="font-bold text-sm mb-2">Subasks (2 out of 3)</h2>
          {/* ** Connect subtasks to state with a form maker */}
          {/* Subtask Subcontainer */}
          <div className="subtask">
            <Checkbox
              checked={checked}
              onChange={() => {
                setChecked(!checked);
              }}
              aria-label="subtask checkbox"
            />
            <span className="text-fontPrimary">
              Research competitors in premium market
            </span>
          </div>
          {/* Subtask Subcontainer */}
          <div className="subtask">
            <Checkbox
              checked={checked}
              onChange={() => {
                setChecked(!checked);
              }}
              aria-label="subtask checkbox"
            />
            <span className="text-fontPrimary">
              Research competitors in premium market
            </span>
          </div>
          {/* Subtask Subcontainer */}
          <div className="subtask">
            <Checkbox
              checked={checked}
              onChange={() => {
                setChecked(!checked);
              }}
              aria-label="subtask checkbox"
            />
            <span className="text-fontPrimary">
              Research competitors in premium market
            </span>
          </div>
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
        <button className="purpleBtn">Create Task</button>
      </form>
    </section>
  );
};

export default EditTaskModal;
