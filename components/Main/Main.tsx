import {
  doc,
  increment,
  runTransaction,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useContext } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { UserContext } from "../../lib/context";
import { db } from "../../lib/firebase";
import Column from "./Column";
import TopSettings from "./TopSettings";

type MainProps = {
  activeBoard: any;
  boards: any;
  setBoards: React.Dispatch<any>;
  boardId: string | null | undefined;
  setBoardId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  tasks: any;
  setTaskId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateBoardName: (uid: string, newName: string) => Promise<void>;
  columns: any;
  setColumns: React.Dispatch<any>;
};

const Main = ({
  activeBoard,
  boards,
  setBoards,
  boardId,
  setBoardId,
  tasks,
  setTaskId,
  setShowAddTaskModal,
  setShowEditTaskModal,
  updateBoardName,
  columns,
  setColumns,
}: MainProps) => {
  // ** Fetching Data
  const user = useContext(UserContext);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Column DnD logic
    if (type === "column") {
      console.log("Column DnD detected:", result);
      let add: any;
      // Removing Column from array at source.index
      let newColumns = columns;
      add = newColumns?.[source.index];
      newColumns?.splice(source.index, 1);
      // Adding Column to array at destination.index
      newColumns?.splice(destination.index, 0, add);

      // Updating DB state
      updateColumnsIndex(
        newColumns[destination.index].status,
        source.index,
        destination.index,
        draggableId
      );

      // Updating Columns state in the UI
      setColumns(newColumns);
    }
    // Task DnD logic
    else if (type === "task") {
      // Removing Task from array at source.index
      const { filteredSourceColumnTasks, draggedTask } = removeTaskDnd(
        parseInt(source.droppableId),
        source.index
      );

      // Adding Task to an array at destination.index & extracting updated Task id
      const { updatedTaskId } = addTaskDnd(
        parseInt(source.droppableId),
        parseInt(destination.droppableId),
        destination.index,
        draggedTask,
        filteredSourceColumnTasks
      );

      // Making changes in Firestore
      if (source.droppableId === destination.droppableId) {
        updateTaskWithinColumn(
          parseInt(source.droppableId),
          source.index,
          destination.index,
          updatedTaskId
        );
      } else {
        updateTaskBetweenColumns(
          updatedTaskId,
          source.index,
          destination.index,
          parseInt(source.droppableId),
          parseInt(destination.droppableId)
        );
      }
    }
  };

  // onDragEnd Helpers
  const updateColumnsIndex = async (
    updatedColumnStatus: number,
    sourceIndex: number,
    destinationIndex: number,
    draggableId: string
  ) => {
    const batch = writeBatch(db);
    // 1. Updating dragged Column
    const columnDocRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${boardId}`,
      "columns",
      `${draggableId}`
    );
    batch.update(columnDocRef, { status: sourceIndex });

    // 2. Updating the indexes of affected Columns
    columns?.map((column: any) => {
      if (column.status === updatedColumnStatus) return;
      if (destinationIndex > sourceIndex) {
        // Decrement
        if (column.status > sourceIndex && column.status <= destinationIndex) {
          const columnDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "columns",
            `${column.status}`
          );
          batch.update(columnDocRef, { status: increment(-1) });
        }
      } else if (destinationIndex < sourceIndex) {
        // Increment
        if (column.status < sourceIndex && column.status >= destinationIndex) {
          const columnDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "columns",
            `${column.status}`
          );
          batch.update(columnDocRef, { status: increment(1) });
        }
      }
    });

    await batch.commit();
  };

  const removeTaskDnd = (initialStatus: number, sourceIndex: number) => {
    // Put the dragged Task into a separate variable
    let draggedTask: {};
    const sourceColumnTasks = tasks?.filter(
      (task: any) => task?.status === initialStatus
    );
    draggedTask = sourceColumnTasks[sourceIndex];

    // Remove Task from array at source.index
    const filteredSourceColumnTasks = sourceColumnTasks.splice(sourceIndex, 1);

    // return Task array (from the respective Column) without the dragged Task
    //  (displays un-updated indexes of these Tasks)
    return { filteredSourceColumnTasks, draggedTask };
  };

  const addTaskDnd = (
    initialStatus: number,
    newStatus: number,
    destinationIndex: number,
    draggedTask: any,
    filteredSourceColumnTasks: any
  ) => {
    let updatedTaskId;
    if (newStatus === initialStatus) {
      // If Task has been dnd'ed within the same column, use the initial array where draggedTask has been removed
      filteredSourceColumnTasks.splice(destinationIndex, 0, draggedTask);
      updatedTaskId = filteredSourceColumnTasks[destinationIndex].uid;
    } else {
      // Otherwise, use scalable logic
      const destinationColumnTasks = tasks?.filter(
        (task: any) => task?.status === newStatus
      );
      destinationColumnTasks.splice(destinationIndex, 0, draggedTask);
      updatedTaskId = destinationColumnTasks[destinationIndex].uid;
    }
    return { updatedTaskId };
  };

  const updateTaskBetweenColumns = async (
    // Dragged Task's uid -> updatedTaskId
    updatedTaskId: string,
    // Source index -> Task's old index within Column -> sourceIndex
    sourceIndex: number,
    // Destination index -> Tasks's new index within Column -> destinationIndex
    destinationIndex: number,
    // Source Column Status -> initialStatus
    initialStatus: number,
    // Destination Column Status -> Task's new Column index -> newStatus
    newStatus: number
  ) => {
    try {
      await runTransaction(db, async (transaction) => {
        // ** 1. Change index & status of dragged Task -> Read, Delete, Write
        const taskDocRef = doc(
          db,
          "users",
          `${user?.uid}`,
          "boards",
          `${boardId}`,
          "columns",
          `${initialStatus}`,
          "tasks",
          `${updatedTaskId}`
        );

        // READ
        const draggedTaskRaw = await transaction.get(taskDocRef);
        if (!draggedTaskRaw.exists()) {
          throw "Task does not exist!";
        }
        const draggedTask = draggedTaskRaw.data();

        const newTaskDocRef = doc(
          db,
          "users",
          `${user?.uid}`,
          "boards",
          `${boardId}`,
          "columns",
          `${newStatus}`,
          "tasks",
          `${updatedTaskId}`
        );
        // CREATE
        transaction.set(newTaskDocRef, {
          // Using type guard to ensure that we're always spreading an object
          ...(typeof draggedTask === "object" ? draggedTask : {}),
          status: newStatus,
          index: destinationIndex,
          updatedAt: Timestamp.fromDate(new Date()),
        });
        // DELETE
        transaction.delete(taskDocRef);

        // ** 2. Decrement (by 1) the indexes of Tasks that came after dragged Task in source Column
        const sourceColumnTasks = tasks?.filter(
          (task: any) => task?.status === initialStatus
        );
        sourceColumnTasks?.map((task: any) => {
          if (task.index >= sourceIndex) {
            if (task.uid === updatedTaskId) return;
            console.log(
              `task to be decremented in Column ${initialStatus}:`,
              task
            );
            const taskDocRef = doc(
              db,
              "users",
              `${user?.uid}`,
              "boards",
              `${boardId}`,
              "columns",
              `${initialStatus}`,
              "tasks",
              `${task?.uid}`
            );
            transaction.update(taskDocRef, { index: increment(-1) });
          }
        });

        // ** 3. Increment (by 1) the indexes of Tasks that came after dragged Task in destination Column
        const destinationColumnTasks = tasks?.filter(
          (task: any) => task?.status === newStatus
        );
        destinationColumnTasks?.map((task: any) => {
          // |task.index reflects the Tasks' indexes before being updated with the dragged Task.
          // That's why the Task index at task.index === destinationIndex should still be incremented.
          if (task.index >= destinationIndex) {
            if (task.uid === updatedTaskId) return;
            console.log(`task to be incremented in Column ${newStatus}:`, task);
            const taskDocRef = doc(
              db,
              "users",
              `${user?.uid}`,
              "boards",
              `${boardId}`,
              "columns",
              `${newStatus}`,
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

    console.log("END OF FUNCTION");
  };

  const updateTaskWithinColumn = async (
    initialStatus: number,
    sourceIndex: number,
    destinationIndex: number,
    updatedTaskId: string
  ) => {
    const batch = writeBatch(db);

    const columnTasks = tasks?.filter(
      (task: any) => task?.status === initialStatus
    );

    columnTasks?.map((task: any) => {
      if (destinationIndex > sourceIndex) {
        // Decrement Tasks
        if (task.index > sourceIndex && task.index <= destinationIndex) {
          // DECREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
          console.log(
            `task to be decremented in Column: ${initialStatus}:`,
            task
          );
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "columns",
            `${initialStatus}`,
            "tasks",
            `${task?.uid}`
          );
          batch.update(taskDocRef, { index: increment(-1) });
        }
      } else if (destinationIndex < sourceIndex) {
        // Increment Tasks
        if (task.index < sourceIndex && task.index >= destinationIndex) {
          // INCREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
          console.log(
            `task to be incremented in Column: ${initialStatus}:`,
            task
          );
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "columns",
            `${initialStatus}`,
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
      "boards",
      `${boardId}`,
      "columns",
      `${initialStatus}`,
      "tasks",
      `${updatedTaskId}`
    );
    batch.update(taskDocRef, {
      index: destinationIndex,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  };

  return (
    <main className="w-4/5">
      <TopSettings
        activeBoard={activeBoard}
        boards={boards}
        setBoards={setBoards}
        boardId={boardId}
        setBoardId={setBoardId}
        setShowAddTaskModal={setShowAddTaskModal}
        updateBoardName={updateBoardName}
      />
      {/* Main content */}
      <DragDropContext onDragEnd={onDragEnd}>
        {/* overflow-x-auto overflow-hidden */}
        {/* flex justify-start items-start gap-6 */}
        <section className="h-[90%] bg-darkBlue p-5 flex justify-between gap-6">
          {/* Current Columns Container */}
          {/* NEW DROPPABLE */}
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
                  // NEW DRAGGABLE
                  <Column
                    key={column?.status}
                    setTaskId={setTaskId}
                    setShowEditTaskModal={setShowEditTaskModal}
                    tasks={tasks}
                    columns={columns}
                    columnStatus={column?.status}
                    columnTitle={column?.title}
                    boardId={boardId}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* Add New Column Container */}
          <div className="min-w-[250px] bg-veryDarkGray mt-11 h-5/6 flex justify-center items-center cursor-pointer rounded-md hover:bg-opacity-50">
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
