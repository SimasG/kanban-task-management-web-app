import {
  doc,
  increment,
  runTransaction,
  setDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { useContext } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { UserContext } from "../../lib/context";
import { db } from "../../lib/firebase";
import Column from "./Column";
import TopSettings from "./TopSettings";
import { v4 as uuidv4 } from "uuid";
import { colorArray } from "../../lib/helpers";

type MainProps = {
  activeBoard: any;
  boards: any;
  boardId: string | null | undefined;
  setBoardId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  tasks: any;
  setTaskId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateBoardName: (uid: string, newName: string) => Promise<void>;
  columns: any;
  isOpen: boolean;
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
  sharedBoardIds: any;
  users: any;
  handleDeleteBoard: any;
  setShowEditCollabsModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Main = ({
  activeBoard,
  boards,
  boardId,
  setBoardId,
  tasks,
  setTaskId,
  setShowAddTaskModal,
  setShowEditTaskModal,
  updateBoardName,
  columns,
  isOpen,
  setShowShareModal,
  sharedBoardIds,
  users,
  handleDeleteBoard,
  setShowEditCollabsModal,
}: MainProps) => {
  const user = useContext(UserContext);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type, draggableId } = result;
    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;
    console.log("onDragEnd ran successfully:", result);

    // Column DnD logic
    if (type === "column") {
      let add: any;
      // Removing Column from array at source.index
      let newColumns = columns;
      add = newColumns?.[source.index];
      newColumns?.splice(source.index, 1);
      // Adding Column to array at destination.index
      newColumns?.splice(destination.index, 0, add);
      // Updating DB state
      updateColumnsIndex(
        newColumns[destination.index].uid,
        source.index,
        destination.index
      );
    }
    // Task DnD logic
    else if (type === "task") {
      const draggedTask = tasks?.find((task: any) => task?.uid === draggableId);
      // Making changes in Firestore
      if (source.droppableId === destination.droppableId) {
        updateTaskWithinColumn(
          source.droppableId,
          source.index,
          destination.index,
          draggedTask?.uid
        );
      } else {
        updateTaskBetweenColumns(
          // Dragged Task's uid -> updatedTaskId
          draggedTask?.uid,
          // Source index -> Task's old index within Column -> sourceIndex
          source.index,
          // Destination index -> Tasks's new index within Column -> destinationIndex
          destination.index,
          // Source Column Id -> sourceColumnId
          source.droppableId,
          // Destination Column Id -> destinationColumnId
          destination.droppableId
        );
      }
    }
  };

  // onDragEnd Helpers
  const updateColumnsIndex = async (
    draggedColumnId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    if (sharedBoardIds.includes(boardId)) {
      console.log("Shared Column DnD");

      // Finding Current User (Invitee) Firebase Doc
      const currentUser = users?.find(
        (currentUser: any) => currentUser.uid === user?.uid
      );
      // Find User Id (Inviter) of the Shared Board
      const sharedBoard = currentUser?.sharedBoards?.find(
        (board: any) => board?.board === boardId
      );

      const batch = writeBatch(db);
      // 1. Updating the indexes of affected Columns
      columns?.map((column: any) => {
        if (column.uid === draggedColumnId) return;
        if (destinationIndex > sourceIndex) {
          if (column.index > sourceIndex && column.index <= destinationIndex) {
            const columnDocRef = doc(
              db,
              "users",
              `${sharedBoard?.user}`,
              "columns",
              `${column.uid}`
            );
            batch.update(columnDocRef, { index: increment(-1) });
          }
        } else if (destinationIndex < sourceIndex) {
          if (column.index < sourceIndex && column.index >= destinationIndex) {
            const columnDocRef = doc(
              db,
              "users",
              `${sharedBoard?.user}`,
              "columns",
              `${column.uid}`
            );
            batch.update(columnDocRef, { index: increment(1) });
          }
        }
      });

      // 2. Updating dragged Column
      const columnDocRef = doc(
        db,
        "users",
        `${sharedBoard?.user}`,
        "columns",
        `${draggedColumnId}`
      );
      batch.update(columnDocRef, {
        index: destinationIndex,
      });

      await batch.commit();
    } else {
      console.log("Personal Column DnD");
      const batch = writeBatch(db);
      // 1. Updating the indexes of affected Columns
      columns?.map((column: any) => {
        if (column.uid === draggedColumnId) return;
        if (destinationIndex > sourceIndex) {
          if (column.index > sourceIndex && column.index <= destinationIndex) {
            const columnDocRef = doc(
              db,
              "users",
              `${user?.uid}`,
              "columns",
              `${column.uid}`
            );
            batch.update(columnDocRef, { index: increment(-1) });
          }
        } else if (destinationIndex < sourceIndex) {
          if (column.index < sourceIndex && column.index >= destinationIndex) {
            const columnDocRef = doc(
              db,
              "users",
              `${user?.uid}`,
              "columns",
              `${column.uid}`
            );
            batch.update(columnDocRef, { index: increment(1) });
          }
        }
      });

      // 2. Updating dragged Column
      const columnDocRef = doc(
        db,
        "users",
        `${user?.uid}`,
        "columns",
        `${draggedColumnId}`
      );
      batch.update(columnDocRef, {
        index: destinationIndex,
      });

      await batch.commit();
    }
  };

  const updateTaskWithinColumn = async (
    sourceColumnId: string,
    sourceIndex: number,
    destinationIndex: number,
    updatedTaskId: string
  ) => {
    const batch = writeBatch(db);

    const sourceColumn = columns?.find(
      (column: any) => column?.uid === sourceColumnId
    );

    const columnTasks = tasks?.filter(
      (task: any) => task?.status === sourceColumn?.status
    );

    if (sharedBoardIds.includes(boardId)) {
      // Task DnD in a shared Board (within Column)

      // Finding Current User (Invitee) Firebase Doc
      const currentUser = users?.find(
        (currentUser: any) => currentUser.uid === user?.uid
      );
      // Find User Id (Inviter) of the Shared Board
      const sharedBoard = currentUser?.sharedBoards?.find(
        (board: any) => board?.board === boardId
      );

      columnTasks?.map((task: any) => {
        if (destinationIndex > sourceIndex) {
          // Decrement Tasks
          if (task.index > sourceIndex && task.index <= destinationIndex) {
            const taskDocRef = doc(
              db,
              "users",
              `${sharedBoard?.user}`,
              "tasks",
              `${task?.uid}`
            );
            batch.update(taskDocRef, { index: increment(-1) });
          }
        } else if (destinationIndex < sourceIndex) {
          // Increment Tasks
          if (task.index < sourceIndex && task.index >= destinationIndex) {
            const taskDocRef = doc(
              db,
              "users",
              `${sharedBoard?.user}`,
              "tasks",
              `${task?.uid}`
            );
            batch.update(taskDocRef, { index: increment(1) });
          }
        }
      });
      // Changing index of dragged Task
      const taskDocRef = doc(
        db,
        "users",
        `${sharedBoard?.user}`,
        "tasks",
        `${updatedTaskId}`
      );
      batch.update(taskDocRef, {
        index: destinationIndex,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      await batch.commit();
    } else {
      // Task DnD in a personal Board (within Column)
      columnTasks?.map((task: any) => {
        if (destinationIndex > sourceIndex) {
          // Decrement Tasks
          if (task.index > sourceIndex && task.index <= destinationIndex) {
            const taskDocRef = doc(
              db,
              "users",
              `${user?.uid}`,
              "tasks",
              `${task?.uid}`
            );
            batch.update(taskDocRef, { index: increment(-1) });
          }
        } else if (destinationIndex < sourceIndex) {
          // Increment Tasks
          if (task.index < sourceIndex && task.index >= destinationIndex) {
            const taskDocRef = doc(
              db,
              "users",
              `${user?.uid}`,
              "tasks",
              `${task?.uid}`
            );
            batch.update(taskDocRef, { index: increment(1) });
          }
        }
      });
      // Changing index of dragged Task
      const taskDocRef = doc(
        db,
        "users",
        `${user?.uid}`,
        "tasks",
        `${updatedTaskId}`
      );
      batch.update(taskDocRef, {
        index: destinationIndex,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      await batch.commit();
    }
  };

  const updateTaskBetweenColumns = async (
    draggedTaskId: string,
    sourceIndex: number,
    destinationIndex: number,
    sourceColumnId: string,
    destinationColumnId: string
  ) => {
    if (sharedBoardIds.includes(boardId)) {
      console.log("Task DnD in a shared Board (between Columns)");

      // Finding Current User (Invitee) Firebase Doc
      const currentUser = users?.find(
        (currentUser: any) => currentUser.uid === user?.uid
      );
      // Find User Id (Inviter) of the Shared Board
      const sharedBoard = currentUser?.sharedBoards?.find(
        (board: any) => board?.board === boardId
      );

      try {
        await runTransaction(db, async (transaction) => {
          // ** 1. Update index & status of dragged Task
          const taskDocRef = doc(
            db,
            "users",
            `${sharedBoard?.user}`,
            "tasks",
            `${draggedTaskId}`
          );

          const destinationColumn = columns?.find(
            (column: any) => column?.uid === destinationColumnId
          );

          transaction.update(taskDocRef, {
            index: destinationIndex,
            status: destinationColumn?.status,
          });

          // ** 2. Decrement (by 1) the indexes of Tasks that came after dragged Task in source Column
          const sourceColumn = columns?.find(
            (column: any) => column?.uid === sourceColumnId
          );
          const sourceColumnTasks = tasks?.filter(
            (task: any) => task?.status === sourceColumn?.status
          );

          sourceColumnTasks?.map((task: any) => {
            if (task.index > sourceIndex) {
              if (task.uid === draggedTaskId) return;
              const taskDocRef = doc(
                db,
                "users",
                `${sharedBoard?.user}`,
                "tasks",
                `${task?.uid}`
              );
              transaction.update(taskDocRef, { index: increment(-1) });
            }
          });

          // ** 3. Increment (by 1) the indexes of Tasks that came after dragged Task in destination Column
          const destinationColumnTasks = tasks?.filter(
            (task: any) => task?.status === destinationColumn?.status
          );
          destinationColumnTasks?.map((task: any) => {
            // |task.index reflects the Tasks' indexes before being updated with the dragged Task.
            // That's why the Task index at task.index === destinationIndex should still be incremented.
            if (task.index >= destinationIndex) {
              if (task.uid === draggedTaskId) return;
              const taskDocRef = doc(
                db,
                "users",
                `${sharedBoard?.user}`,
                "tasks",
                `${task?.uid}`
              );
              transaction.update(taskDocRef, { index: increment(1) });
            }
          });
        });
      } catch (err) {
        console.log("Transaction failed: ", err);
      }
    } else {
      console.log("Task DnD in a personal Board (between Columns)");
      try {
        await runTransaction(db, async (transaction) => {
          // ** 1. Update index & status of dragged Task
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "tasks",
            `${draggedTaskId}`
          );

          const destinationColumn = columns?.find(
            (column: any) => column?.uid === destinationColumnId
          );

          transaction.update(taskDocRef, {
            index: destinationIndex,
            status: destinationColumn?.status,
          });

          // ** 2. Decrement (by 1) the indexes of Tasks that came after dragged Task in source Column
          const sourceColumn = columns?.find(
            (column: any) => column?.uid === sourceColumnId
          );
          const sourceColumnTasks = tasks?.filter(
            (task: any) => task?.status === sourceColumn?.status
          );

          sourceColumnTasks?.map((task: any) => {
            if (task.index > sourceIndex) {
              if (task.uid === draggedTaskId) return;
              const taskDocRef = doc(
                db,
                "users",
                `${user?.uid}`,
                "tasks",
                `${task?.uid}`
              );
              transaction.update(taskDocRef, { index: increment(-1) });
            }
          });

          // ** 3. Increment (by 1) the indexes of Tasks that came after dragged Task in destination Column
          const destinationColumnTasks = tasks?.filter(
            (task: any) => task?.status === destinationColumn?.status
          );
          destinationColumnTasks?.map((task: any) => {
            // |task.index reflects the Tasks' indexes before being updated with the dragged Task.
            // That's why the Task index at task.index === destinationIndex should still be incremented.
            if (task.index >= destinationIndex) {
              if (task.uid === draggedTaskId) return;
              const taskDocRef = doc(
                db,
                "users",
                `${user?.uid}`,
                "tasks",
                `${task?.uid}`
              );
              transaction.update(taskDocRef, { index: increment(1) });
            }
          });
        });
      } catch (err) {
        console.log("Transaction failed: ", err);
      }
    }
  };

  const addNewColumn = async () => {
    const uuid = uuidv4();
    let newColumnDocRef: any;

    if (sharedBoardIds.includes(boardId)) {
      console.log("Add New Column in a shared Board");
      // Finding Current User (Invitee) Firebase Doc
      const currentUser = users?.find(
        (currentUser: any) => currentUser.uid === user?.uid
      );
      // Find User Id (Inviter) of the Shared Board
      const sharedBoard = currentUser?.sharedBoards?.find(
        (board: any) => board?.board === boardId
      );
      newColumnDocRef = doc(
        db,
        "users",
        `${sharedBoard?.user}`,
        "columns",
        `${uuid}`
      );
    } else {
      console.log("Add New Column in a personal Board");
      newColumnDocRef = doc(db, "users", `${user?.uid}`, "columns", `${uuid}`);
    }

    const random = Math.floor(Math.random() * colorArray.length);
    await setDoc(newColumnDocRef, {
      index: columns?.length,
      status: columns?.length,
      title: "todo",
      uid: uuid,
      color: colorArray[random],
      board: boardId,
    });
  };

  return (
    <main
      className={`${
        isOpen
          ? "w-[100%] sm:w-[60%] md:w-[65%] lg:w-[75%] xl:w-[80%]"
          : "w-[88%] sm:w-[92%] lg:w-[92%] xl:w-[92%]"
      }`}
    >
      <TopSettings
        activeBoard={activeBoard}
        boards={boards}
        boardId={boardId}
        setBoardId={setBoardId}
        setShowAddTaskModal={setShowAddTaskModal}
        updateBoardName={updateBoardName}
        columns={columns}
        setShowShareModal={setShowShareModal}
        sharedBoardIds={sharedBoardIds}
        handleDeleteBoard={handleDeleteBoard}
        users={users}
        setShowEditCollabsModal={setShowEditCollabsModal}
      />
      {/* Main content */}
      <DragDropContext onDragEnd={onDragEnd}>
        <section className="h-[90%] bg-backgroundColorMain dark:bg-darkBlue p-5 flex justify-between gap-6 overflow-auto">
          {/* Current Columns Container */}
          <Droppable
            droppableId="allColumns"
            direction="horizontal"
            type="column"
          >
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex justify-start items-start gap-6"
              >
                {columns?.map((column: any, index: number) => (
                  <Column
                    key={column?.uid}
                    setTaskId={setTaskId}
                    setShowEditTaskModal={setShowEditTaskModal}
                    tasks={tasks}
                    columnStatus={column?.status}
                    columnTitle={column?.title}
                    columnId={column?.uid}
                    columnColor={column?.color}
                    boardId={boardId}
                    index={index}
                    sharedBoardIds={sharedBoardIds}
                    users={users}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* Add New Column Container */}
          <div
            onClick={addNewColumn}
            className="min-w-[250px] bg-backgroundColor2 dark:bg-veryDarkGray hover:bg-[#eff2fa] dark:hover:bg-[#23262f] mt-11 h-5/6 flex justify-center items-center cursor-pointer rounded-md drop-shadow-lg hover:drop-shadow-xl"
          >
            <h2 className="mb-56 text-2xl text-fontSecondary font-bold">
              + New Column
            </h2>
          </div>
        </section>
      </DragDropContext>
    </main>
  );
};

export default Main;
