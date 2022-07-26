import {
  doc,
  increment,
  runTransaction,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useContext } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
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
}: MainProps) => {
  // ** Fetching Data
  const user = useContext(UserContext);

  const updateBoardName = async (uid: string, newName: string) => {
    const ref = doc(db, "users", `${user?.uid}`, "boards", uid);
    await updateDoc(ref, {
      title: newName,
    });
  };

  // Calculating todo/doing/done task #
  let todoCount = 0;
  let doingCount = 0;
  let doneCount = 0;

  tasks?.map((task: any) => {
    task.status === 1 && todoCount++;
    task.status === 2 && doingCount++;
    task.status === 3 && doneCount++;
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    // if (!destination) return;
    // if (
    //   destination.droppableId === source.droppableId &&
    //   destination.index === source.index
    // )
    //   return;

    console.log("onDragEnd ran", result);

    let add;

    // Removing Task from array at source.index
    // if (source.droppableId === "1") {
    //   add = todos[source.index];
    //   todos.splice(source.index, 1);
    // } else if (source.droppableId === "2") {
    //   add = doings[source.index];
    //   doings.splice(source.index, 1);
    // } else if (source.droppableId === "3") {
    //   add = dones[source.index];
    //   dones.splice(source.index, 1);
    // }

    // Adding Task to an array at destination.index
    // if (destination.droppableId === "1") {
    //   todos.splice(destination.index, 0, add);
    //   handleUpdateTask(
    //     todos[destination.index].uid,
    //     source.index,
    //     destination.index,
    //     parseInt(source.droppableId),
    //     parseInt(destination.droppableId)
    //   );
    // } else if (destination.droppableId === "2") {
    //   doings.splice(destination.index, 0, add);
    //   handleUpdateTask(
    //     doings[destination.index].uid,
    //     source.index,
    //     destination.index,
    //     parseInt(source.droppableId),
    //     parseInt(destination.droppableId)
    //   );
    // } else if (destination.droppableId === "3") {
    //   dones.splice(destination.index, 0, add);
    //   handleUpdateTask(
    //     dones[destination.index].uid,
    //     source.index,
    //     destination.index,
    //     parseInt(source.droppableId),
    //     parseInt(destination.droppableId)
    //   );
    // }
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

    // ** WITHIN COLUMN LOGIC
    if (newStatus === initialStatus) {
      console.log("Within column logic detected");
      // TODOS
      if (newStatus === 1) {
        todos?.map((todo: any) => {
          if (destinationIndex > sourceIndex) {
            // Decrement Tasks
            if (todo.index > sourceIndex && todo.index <= destinationIndex) {
              // DECREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
              console.log("todo to be decremented:", todo);
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
              batch.update(taskDocRef, { index: increment(-1) });
            }
          } else if (destinationIndex < sourceIndex) {
            // Increment Tasks
            if (todo.index < sourceIndex && todo.index >= destinationIndex) {
              // INCREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
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
          `${newStatus}`,
          "tasks",
          `${updatedTaskId}`
        );
        batch.update(taskDocRef, {
          // Using type guard to ensure that we're always spreading an object
          // ...(typeof updatedTask === "object" ? updatedTask : {}),
          index: destinationIndex,
          updatedAt: Timestamp.fromDate(new Date()),
        });
      }
      // DOINGS
      else if (newStatus === 2) {
        doings?.map((doing: any) => {
          if (destinationIndex > sourceIndex) {
            // Decrement Tasks
            if (doing.index > sourceIndex && doing.index <= destinationIndex) {
              // DECREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
              console.log("doing to be decremented:", doing);
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
              batch.update(taskDocRef, { index: increment(-1) });
            }
          } else if (destinationIndex < sourceIndex) {
            // Increment Tasks
            if (doing.index < sourceIndex && doing.index >= destinationIndex) {
              // INCREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
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
          `${newStatus}`,
          "tasks",
          `${updatedTaskId}`
        );
        batch.update(taskDocRef, {
          index: destinationIndex,
          updatedAt: Timestamp.fromDate(new Date()),
        });
      }
      // DONES
      else if (newStatus === 3) {
        dones?.map((done: any) => {
          if (destinationIndex > sourceIndex) {
            // Decrement Tasks
            if (done.index > sourceIndex && done.index <= destinationIndex) {
              // DECREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
              console.log("done to be decremented:", done);
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
              batch.update(taskDocRef, { index: increment(-1) });
            }
          } else if (destinationIndex < sourceIndex) {
            // Increment Tasks
            if (done.index < sourceIndex && done.index >= destinationIndex) {
              // INCREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
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
          `${newStatus}`,
          "tasks",
          `${updatedTaskId}`
        );
        batch.update(taskDocRef, {
          index: destinationIndex,
          updatedAt: Timestamp.fromDate(new Date()),
        });
      }
      await batch.commit();
      return;
    }

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

  return (
    <main className="w-4/5">
      <TopSettings
        activeBoard={activeBoard}
        updateBoardName={updateBoardName}
        boards={boards}
        setBoards={setBoards}
        boardId={boardId}
        setBoardId={setBoardId}
        setShowAddTaskModal={setShowAddTaskModal}
      />
      {/* Main content */}
      <DragDropContext onDragEnd={onDragEnd}>
        {/* overflow-x-auto overflow-hidden */}
        <section className="h-[90%] bg-darkBlue p-5 flex justify-start items-start gap-6 ">
          {/* Hardcoding the Column count *for now* */}
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
