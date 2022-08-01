import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { UserContext } from "../../lib/context";
import { db } from "../../lib/firebase";
import { defaultColumns } from "../../lib/helpers";

type ColumnProps = {
  setTaskId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: any;
  columnStatus: number;
  columnTitle: string;
  boardId: string | null | undefined;
  index: number;
  columnId: string;
  columnColor: string;
};

const Column = ({
  setTaskId,
  setShowEditTaskModal,
  tasks,
  columnStatus,
  columnTitle,
  columnId,
  boardId,
  index,
  columnColor,
}: ColumnProps) => {
  const user = useContext(UserContext);

  const [hover, setHover] = useState(false);

  const taskCount = tasks?.filter(
    (task: any) => task?.status === columnStatus
  ).length;

  const changeColumnTitle = async (newTitle: string) => {
    const columnDocRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${boardId}`,
      "columns",
      `${columnId}`
    );
    await updateDoc(columnDocRef, { title: newTitle });
  };

  const deleteColumn = async () => {
    const columnDocRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${boardId}`,
      "columns",
      `${columnId}`
    );
    await deleteDoc(columnDocRef);
  };

  return (
    // ** It's important not to put index # as the draggableId (not sure why)
    // I'm already adding a key to the mapped <Column/> but if I
    // don't specify the key here, the Column DnD doesn't work. Not sure why.
    <Draggable key={columnId} draggableId={columnId} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className={`min-w-[250px] max-w-[350px] rounded-md ${
            hover && "hover:bg-gray-700"
          }`}
        >
          {/* Column Title Container */}
          <div
            {...provided.dragHandleProps}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="flex justify-start items-center gap-2 mb-6 text-sm cursor-pointer"
          >
            {/* Colorful circle */}

            <div className={`h-4 w-4 rounded-full bg-[${columnColor}]`}></div>
            {/* <div className={`h-4 w-4 rounded-full ${columnColor}`}></div> */}
            {/* Column Title */}
            <input
              value={`${columnTitle}`}
              onChange={(e) => changeColumnTitle(e.target.value)}
              className="uppercase text-fontSecondary font-bold bg-transparent cursor-pointer outline-none hover:opacity-75 w-16 max-w-fit"
            />
            {/* Task Count */}
            <h3 className="text-fontSecondary font-bold">{`(${taskCount})`}</h3>
            {index >= defaultColumns.length && (
              // Delete Column btn
              <svg
                onClick={() => deleteColumn()}
                className="w-10 h-10 p-2 text-fontSecondary rounded cursor-pointer hover:bg-backgroundColorMain hover:dark:bg-darkBlue"
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
            )}
          </div>
          {/* Task Container */}
          <Droppable droppableId={columnId} type="task">
            {/* Are we using the render props pattern to display the Droppable component 
    because that's the ideal way to access Droppable's props (provided & snapshot)? */}
            {(provided: DroppableProvided) => {
              return (
                // "ref" allows the Droppable component to control its children components/tags
                <div
                  className="flex flex-col justify-start items-center gap-4 rounded-md h-screen"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tasks
                    ?.filter((task: any) => task?.status === columnStatus)
                    ?.map((task: any, index: number) => {
                      let checkedNumber = 0;
                      task.subtasks.map((subtask: any) => {
                        subtask.checked && checkedNumber++;
                      });
                      return (
                        <Draggable
                          key={task.uid}
                          draggableId={task.uid}
                          index={index}
                        >
                          {(provided: DraggableProvided, snapshot: any) => {
                            return (
                              <div
                                onClick={(e) => {
                                  setTaskId(task?.uid);
                                  e.stopPropagation();
                                  setShowEditTaskModal(true);
                                }}
                                className="task"
                                key={task?.uid}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <h2 className="task-title">{task?.title}</h2>
                                <span className="task-body">
                                  {checkedNumber} of {task.subtasks.length}{" "}
                                  subtasks
                                </span>
                              </div>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
