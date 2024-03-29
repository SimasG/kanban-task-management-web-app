import { doc, updateDoc, writeBatch } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { UserContext } from "../../lib/context";
import { db } from "../../lib/firebase";
import { defaultColumns } from "../../lib/helpers";
import {
  ColumnSchema,
  SharedBoardRef,
  SubtaskSchema,
  TaskSchema,
  UserSchema,
} from "../../lib/types";

type ColumnProps = {
  setTaskId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: TaskSchema[] | undefined;
  column: ColumnSchema;
  activeBoardId: string | null | undefined;
  index: number;
  sharedBoardIds: (string | null | undefined)[];
  users: UserSchema[];
};

const Column = ({
  setTaskId,
  setShowEditTaskModal,
  tasks,
  column,
  activeBoardId,
  index,
  sharedBoardIds,
  users,
}: ColumnProps) => {
  const user = useContext(UserContext);

  const [hover, setHover] = useState(false);

  const taskCount = tasks?.filter(
    (task: TaskSchema) => task?.status === column?.status
  ).length;

  const changeColumnTitle = async (newTitle: string) => {
    if (sharedBoardIds.includes(activeBoardId)) {
      console.log("Update shared Column Title");
      // Finding Current User (Invitee) Firebase Doc
      const currentUser = users?.find(
        (currentUser: UserSchema) => currentUser?.uid === user?.uid
      );
      // Find User Id (Inviter) of the Shared Board
      const sharedBoardRef = currentUser?.sharedBoardRefs?.find(
        (sharedBoardRef: SharedBoardRef) =>
          sharedBoardRef?.board === activeBoardId
      );
      const columnDocRef = doc(
        db,
        "users",
        `${sharedBoardRef?.user}`,
        "columns",
        `${column?.uid}`
      );
      await updateDoc(columnDocRef, { title: newTitle });
    } else {
      console.log("Update personal Column Title");
      const columnDocRef = doc(
        db,
        "users",
        `${user?.uid}`,
        "columns",
        `${column?.uid}`
      );
      await updateDoc(columnDocRef, { title: newTitle });
    }
  };

  const deleteColumn = async () => {
    if (sharedBoardIds.includes(activeBoardId)) {
      console.log("Delete Column in a shared Board");
      // Finding Current User (Invitee) Firebase Doc
      const currentUser = users?.find(
        (currentUser: UserSchema) => currentUser?.uid === user?.uid
      );
      // Find User Id (Inviter) of the Shared Board
      const sharedBoardRef = currentUser?.sharedBoardRefs?.find(
        (sharedBoardRef: SharedBoardRef) =>
          sharedBoardRef?.board === activeBoardId
      );

      // Deleting the Column & Tasks that are in the Column
      const batch = writeBatch(db);
      const columnDocRef = doc(
        db,
        "users",
        `${sharedBoardRef?.user}`,
        "columns",
        `${column?.uid}`
      );
      batch.delete(columnDocRef);

      const tasksToDelete = tasks?.filter(
        (task: TaskSchema) => task?.status === column?.status
      );

      tasksToDelete?.map((task: TaskSchema) => {
        const taskDocRef = doc(
          db,
          "users",
          `${sharedBoardRef?.user}`,
          "tasks",
          `${task?.uid}`
        );
        batch.delete(taskDocRef);
      });
      await batch.commit();
      toast.success(`${column?.title} Deleted!`);
    } else {
      console.log("Delete Column in a personal Board");
      // Deleting the Column & Tasks that are in the Column
      const batch = writeBatch(db);
      const columnDocRef = doc(
        db,
        "users",
        `${user?.uid}`,
        "columns",
        `${column?.uid}`
      );
      batch.delete(columnDocRef);

      const tasksToDelete = tasks?.filter(
        (task: TaskSchema) => task?.status === column?.status
      );

      tasksToDelete?.map((task: TaskSchema) => {
        const taskDocRef = doc(
          db,
          "users",
          `${user?.uid}`,
          "tasks",
          `${task?.uid}`
        );
        batch.delete(taskDocRef);
      });
      await batch.commit();
      toast.success(`${column?.title} Deleted!`);
    }
  };

  return (
    // ** It's important not to put index # as the draggableId (not sure why)
    // I'm already adding a key to the mapped <Column/> but if I
    // don't specify the key here, the Column DnD doesn't work. Not sure why.
    <Draggable key={column?.uid} draggableId={column?.uid || ""} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          // min-w-[250px] max-w-[350px]
          className={`w-[140px] sm:w-[160px] md:w-[180px] lg:w-[220px] xl:w-[250px] 2xl:w-[300px] rounded-md ${
            hover && "hover:bg-[#e1e9f3] dark:hover:bg-[#232331]"
          }`}
        >
          {/* Column Title Container */}
          <div
            {...provided.dragHandleProps}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`flex items-center text-sm cursor-pointer p-2 ${
              index >= defaultColumns.length
                ? "justify-between gap-2"
                : "justify-between gap-2 h-[56px]"
            }`}
          >
            {index >= defaultColumns.length ? (
              <>
                <div className="flex justify-between items-center gap-2">
                  {/* Colorful circle */}
                  <div
                    className={`h-3 w-3 xl:h-4 xl:w-4 rounded-full`}
                    style={{ backgroundColor: column?.color }}
                  ></div>
                  {/* Column Title + Task Count Container */}
                  <div className="flex justify-start items-center">
                    {/* Column Title */}
                    <input
                      value={`${column?.title}`}
                      onChange={(e) => changeColumnTitle(e.target.value)}
                      className="w-[50px] sm:w-[60px] md:w-[70px] md:text-xs lg:w-[100px] xl:w-[140px] 2xl:w-[180px] uppercase text-fontSecondary font-bold bg-transparent cursor-pointer outline-none pr-2 hover:opacity-75"
                    />
                  </div>
                </div>
                {/* Task Count + Delete Column Btn Container */}
                <div className="flex justify-center items-center gap-1">
                  {/* Task Count */}
                  <h3 className="text-fontSecondary font-bold">{`(${taskCount})`}</h3>
                  {/* Delete Column btn */}
                  <svg
                    onClick={() => deleteColumn()}
                    className="w-8 h-8 lg:w-10 lg:h-10 p-1 lg:p-2 text-fontSecondary rounded cursor-pointer hover:bg-backgroundColorMain hover:dark:bg-darkBlue"
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
              </>
            ) : (
              <>
                {/* Colorful Circle + Column Title Container */}
                <div className="flex justify-center items-center gap-2">
                  {/* Colorful Circle */}
                  <div
                    className={`h-3 w-3 xl:h-4 xl:w-4 rounded-full`}
                    style={{ backgroundColor: column?.color }}
                  ></div>
                  {/* Column Title */}
                  <input
                    value={`${column?.title}`}
                    onChange={(e) => changeColumnTitle(e.target.value)}
                    className="w-[70px] sm:w-[80px] md:w-[100px] md:text-xs lg:w-[140px] xl:w-[160px] 2xl:w-[220px] uppercase text-fontSecondary font-bold bg-transparent cursor-pointer outline-none hover:opacity-75"
                  />
                </div>
                {/* Task Count */}
                <h3 className="text-fontSecondary font-bold">{`(${taskCount})`}</h3>
              </>
            )}
          </div>
          {/* Task Container */}
          <Droppable droppableId={column?.uid || ""} type="task">
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
                    ?.filter(
                      (task: TaskSchema) => task?.status === column?.status
                    )
                    ?.map((task: TaskSchema, index: number) => {
                      let checkedNumber = 0;
                      task?.subtasks.map((subtask: SubtaskSchema) => {
                        subtask.checked && checkedNumber++;
                      });
                      return (
                        <Draggable
                          key={task?.uid}
                          draggableId={task?.uid || ""}
                          index={index}
                        >
                          {(provided: DraggableProvided) => {
                            return (
                              <div
                                onClick={(e) => {
                                  setTaskId(task?.uid);
                                  e.stopPropagation();
                                  setShowEditTaskModal(true);
                                }}
                                className="task drop-shadow-lg hover:drop-shadow-xl"
                                key={task?.uid}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <h2 className="task-title">{task?.title}</h2>
                                <span className="task-body">
                                  {checkedNumber} of {task?.subtasks.length}{" "}
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
