import {
  doc,
  increment,
  runTransaction,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { useContext } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
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
  todos: any;
  doings: any;
  dones: any;
  tasks: any;
  setTaskId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateBoardName: (uid: string, newName: string) => Promise<void>;
};

const Main = ({
  activeBoard,
  boards,
  setBoards,
  boardId,
  setBoardId,
  todos,
  doings,
  dones,
  tasks,
  setTaskId,
  setShowAddTaskModal,
  setShowEditTaskModal,
  updateBoardName,
}: MainProps) => {
  // ** Fetching Data
  const user = useContext(UserContext);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    console.log("onDragEnd ran", result);

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
      // updateTaskBetweenColumns()
      handleUpdateTask(
        updatedTaskId,
        source.index,
        destination.index,
        parseInt(source.droppableId),
        parseInt(destination.droppableId)
      );
    }

    // handleUpdateTask(
    //   updatedTaskId,
    //   source.index,
    //   destination.index,
    //   parseInt(source.droppableId),
    //   parseInt(destination.droppableId)
    // );
  };

  // onDragEnd Helper Functions
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

  const handleUpdateTask = async (
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
    // Creating a new write Batch
    const batch = writeBatch(db);

    // ** BETWEEN COLUMN LOGIC
    // ** 1. Decrement (by 1) the indexes of Tasks that came after dragged Task in source Column
    if (initialStatus === 1) {
      console.log("Source Column is todos");
      todos?.map((todo: any) => {
        if (todo.index >= sourceIndex) {
          console.log("todo to be decremented:", todo);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "columns",
            `${initialStatus}`,
            "tasks",
            `${todo?.uid}`
          );
          batch.update(taskDocRef, { index: increment(-1) });
        }
      });
    } else if (initialStatus === 2) {
      console.log("Source Column is doing");
      doings?.map((doing: any) => {
        if (doing.index >= sourceIndex) {
          console.log("doing to be decremented:", doing);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "columns",
            `${initialStatus}`,
            "tasks",
            `${doing?.uid}`
          );
          batch.update(taskDocRef, { index: increment(-1) });
        }
      });
    } else if (initialStatus === 3) {
      console.log("Source Column is done");
      dones?.map((done: any) => {
        if (done.index >= sourceIndex) {
          console.log("done to be decremented:", done);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "columns",
            `${initialStatus}`,
            "tasks",
            `${done?.uid}`
          );
          batch.update(taskDocRef, { index: increment(-1) });
        }
      });
    }

    // ** 2. Increment (by 1) the indexes of Tasks that came after dragged Task in destination Column
    if (newStatus === 1) {
      console.log("Destination Column is todos");
      todos?.map((todo: any) => {
        // |todo.index reflects the Tasks' indexes before being updated with the dragged Task.
        // That's why the Task index at todo.index === destinationIndex should still be incremented.
        if (todo.index >= destinationIndex) {
          if (todo.uid === updatedTaskId) return;
          console.log("todo to be incremented:", todo);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "columns",
            `${newStatus}`,
            "tasks",
            `${todo?.uid}`
          );
          batch.update(taskDocRef, { index: increment(1) });
        }
      });
    } else if (newStatus === 2) {
      console.log("Destination Column is doing");
      doings?.map((doing: any) => {
        if (doing.index >= destinationIndex) {
          if (doing.uid === updatedTaskId) return;
          console.log("doing to be incremented:", doing);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "columns",
            `${newStatus}`,
            "tasks",
            `${doing?.uid}`
          );
          batch.update(taskDocRef, { index: increment(1) });
        }
      });
    } else if (newStatus === 3) {
      console.log("Destination Column is done");
      dones?.map((done: any) => {
        if (done.index >= destinationIndex) {
          if (done.uid === updatedTaskId) return;
          console.log("done to be incremented:", done);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "columns",
            `${newStatus}`,
            "tasks",
            `${done?.uid}`
          );
          batch.update(taskDocRef, { index: increment(1) });
        }
      });
    }

    // ** 3. Change index & status of dragged Task -> Read, Delete, Write
    try {
      await runTransaction(db, async (transaction) => {
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
      });
      // ** Commiting the batched writes from 1. (decrements) & 2. (increments) only when the transaction has succeeded.
      await batch.commit();
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
      (task: any) => task?.uid === initialStatus
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
        <section className="h-[90%] bg-darkBlue p-5 flex justify-start items-start gap-6 ">
          {/* Hardcoding the Column count *for now* */}
          {/* Columns? -> later */}
          <Column
            setTaskId={setTaskId}
            setShowEditTaskModal={setShowEditTaskModal}
            tasks={tasks}
            columnStatus={1}
          />
          <Column
            setTaskId={setTaskId}
            setShowEditTaskModal={setShowEditTaskModal}
            tasks={tasks}
            columnStatus={2}
          />
          <Column
            setTaskId={setTaskId}
            setShowEditTaskModal={setShowEditTaskModal}
            tasks={tasks}
            columnStatus={3}
          />
          {/* Add New Column btn */}
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
