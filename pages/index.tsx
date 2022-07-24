import {
  collection,
  deleteDoc,
  doc,
  FieldValue,
  getDocs,
  increment,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import AddNewTaskModal from "../components/AddNewTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import SideNav from "../components/SideNav";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import useFetchFsBoards from "../lib/hooks/useFetchFsBoards";
import useFetchFsTasks from "../lib/hooks/useFetchFsTasks";

// type LocalStorageBoardSchema = {
//   boards: {
//     title: string;
//     id: string | null | undefined;
// createdAt: any
//   }[];
// };

type BoardSchema = {
  title: string;
  uid: string | null | undefined;
  createdAt: FieldValue;
};

const Home: NextPage = () => {
  const user = useContext(UserContext);
  // Fetching all Boards
  const fsBoards = useFetchFsBoards(user?.uid);

  // States
  // ** Main State
  const [boards, setBoards] = useState<
    // ** Change "any" later -> change it once the data schema is more clear
    BoardSchema[] | null | any
  >(null);
  const [tasks, setTasks] = useState<any>(null);
  const [todoTasks, setTodoTasks] = useState<any>(null);
  const [doingTasks, setDoingTasks] = useState<any>(null);
  const [doneTasks, setDoneTasks] = useState<any>(null);

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [boardId, setBoardId] = useState<string | null | undefined>(null);
  const [taskId, setTaskId] = useState<string | null | undefined>(null);

  // Fetching all Tasks of selected Board
  const fsTasks = useFetchFsTasks(user?.uid, boardId);

  // Separating Tasks array into arrays of Tasks for different columns -> to ensure each column's Tasks are zero-indexed
  const todoTasksArray: any = fsTasks?.filter(
    (task: any) => task?.status === 1
  );
  const doingTasksArray: any = fsTasks?.filter(
    (task: any) => task?.status === 2
  );
  const doneTasksArray: any = fsTasks?.filter(
    (task: any) => task?.status === 3
  );

  let todos = todoTasks;
  let doings = doingTasks;
  let dones = doneTasks;

  // Setting main state either from localStorage or Firestore
  useEffect(() => {
    if (!user) {
      // If localStorage is empty, do not try to set the main state from it
      if (localStorage.getItem("boards") || "" !== "") {
        setBoards(JSON.parse(localStorage.getItem("boards") || ""));
        setBoardId(JSON.parse(localStorage.getItem("boards") || "")?.[0]?.id);
      }
      return;
    } else {
      // Ensuring that I only set the main state from Firestore once the data has been fetched (async protection)
      if (!fsBoards) return;
      setBoards(fsBoards);
      if (activeBoard === undefined && fsBoards?.length !== 0) {
        setBoardId(fsBoards?.[0]?.id);
      }
      if (!fsTasks) return;
      setTasks(fsTasks);
      // By default set the state of Tasks via todos/doings/dones because they're automatically sorted
      // in the correct order. Use todoTasksArray/etc only for the initial state load.
      setTodoTasks(todoTasksArray);
      setDoingTasks(doingTasksArray);
      setDoneTasks(doneTasksArray);
    }
  }, [fsBoards, fsTasks, user]);

  const activeBoard = boards?.filter(
    (board: BoardSchema) => board.uid === boardId
  );

  // Buttons
  const handleAddNewTaskBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowAddTaskModal(true);
  };

  const handleEditTask = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowEditTaskModal(true);
  };

  const handleDeleteBoard = async (uid: string | null | undefined) => {
    // Deleting Board from localStorage
    if (!user) {
      const lsData = JSON.parse(localStorage.getItem("boards") || "");
      const newData = lsData.filter((board: BoardSchema) => board.uid !== uid);
      localStorage.setItem("boards", JSON.stringify(newData));
      setBoards(newData);
      setBoardId(newData?.[0]?.uid);
    } else {
      // Deleting Board from Firestore
      const docRef = doc(db, "users", `${user?.uid}`, "boards", `${uid}`);
      // If the first Board in the array is deleted, setId to the second Board (which will become the
      // first once the first one is removed from FS). Else, remove the first Board in the array.
      boards?.[0]?.uid === uid
        ? setBoardId(boards?.[1]?.uid)
        : setBoardId(boards?.[0]?.uid);
      await deleteDoc(docRef);
    }
  };

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
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    console.log("onDragEnd ran", result);

    let add;

    if (source.droppableId === "1") {
      add = todos[source.index];
      todos.splice(source.index, 1);
    } else if (source.droppableId === "2") {
      add = doings[source.index];
      doings.splice(source.index, 1);
    } else if (source.droppableId === "3") {
      add = dones[source.index];
      dones.splice(source.index, 1);
    }

    if (destination.droppableId === "1") {
      todos.splice(destination.index, 0, add);
      handleUpdateTask(
        todos[destination.index].uid,
        source.index,
        destination.index,
        parseInt(source.droppableId),
        1
      );
    } else if (destination.droppableId === "2") {
      doings.splice(destination.index, 0, add);
      handleUpdateTask(
        doings[destination.index].uid,
        source.index,
        destination.index,
        parseInt(source.droppableId),
        2
      );
    } else if (destination.droppableId === "3") {
      dones.splice(destination.index, 0, add);
      handleUpdateTask(
        dones[destination.index].uid,
        source.index,
        destination.index,
        parseInt(source.droppableId),
        3
      );
    }

    setTodoTasks(todos);
    setDoingTasks(doings);
    setDoneTasks(dones);
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
    // Same as "destination.droppableId === source.droppableId"
    if (newStatus === initialStatus) {
      console.log("Within column logic detected");
      if (newStatus === 1) {
        console.log("sourceIndex:", sourceIndex);
        console.log("destinationIndex:", destinationIndex);
        todos?.map((todo: any) => {
          if (destinationIndex > sourceIndex) {
            // Decrement Tasks
            if (todo.index > sourceIndex) {
              // DECREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
              console.log("todo to be decremented:", todo);
              // const taskDocRef = doc(
              //   db,
              //   "users",
              //   `${user?.uid}`,
              //   "boards",
              //   `${boardId}`,
              //   "tasks",
              //   `${todo?.uid}`
              // );
              // batch.update(taskDocRef, { index: increment(-1) });
            }
          } else if (destinationIndex < sourceIndex) {
            // Increment Tasks
            if (todo.index >= destinationIndex) {
              // INCREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
              console.log("todo to be incremented:", todo);
              // const taskDocRef = doc(
              //   db,
              //   "users",
              //   `${user?.uid}`,
              //   "boards",
              //   `${boardId}`,
              //   "tasks",
              //   `${todo?.uid}`
              // );
              // batch.update(taskDocRef, { index: increment(-1) });
            }
          }
        });

        // Changing index of dragged Task
        // const taskDocRef = doc(
        //   db,
        //   "users",
        //   `${user?.uid}`,
        //   "boards",
        //   `${boardId}`,
        //   "tasks",
        //   `${updatedTaskId}`
        // );
        // batch.update(taskDocRef, {
        //   // Using type guard to ensure that we're always spreading an object
        //   // ...(typeof updatedTask === "object" ? updatedTask : {}),
        //   index: destinationIndex,
        //   updatedAt: Timestamp.fromDate(new Date()),
        // });
      }
      return;
    }

    // ** BETWEEN COLUMN LOGIC
    // ** 1. Change index & status of dragged Task
    const taskDocRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${boardId}`,
      "tasks",
      `${updatedTaskId}`
    );
    batch.update(taskDocRef, {
      // Using type guard to ensure that we're always spreading an object
      // ...(typeof updatedTask === "object" ? updatedTask : {}),
      index: destinationIndex,
      status: newStatus,
      updatedAt: Timestamp.fromDate(new Date()),
    });

    // ** 2. Decrement (by 1) the indexes of Tasks that came after dragged Task in source Column
    if (initialStatus === 1) {
      console.log("Source Column is todos");
      todos?.map((todo: any, index: number) => {
        if (index >= sourceIndex) {
          // DECREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
          console.log("todo to be decremented:", todo);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "tasks",
            `${todo?.uid}`
          );
          batch.update(taskDocRef, { index: increment(-1) });
        }
      });
    } else if (initialStatus === 2) {
      console.log("Source Column is doing");
      doings?.map((doing: any, index: number) => {
        if (index >= sourceIndex) {
          // DECREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
          console.log("doing to be decremented:", doing);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "tasks",
            `${doing?.uid}`
          );
          batch.update(taskDocRef, { index: increment(-1) });
        }
      });
    } else if (initialStatus === 3) {
      console.log("Source Column is done");
      dones?.map((done: any, index: number) => {
        if (index >= sourceIndex) {
          // DECREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
          console.log("done to be decremented:", done);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "tasks",
            `${done?.uid}`
          );
          batch.update(taskDocRef, { index: increment(-1) });
        }
      });
    }

    // ** 3. Increment (by 1) the indexes of Tasks that came after dragged Task in destination Column
    if (newStatus === 1) {
      console.log("Destination Column is todos");
      todos?.map((todo: any, index: number) => {
        if (index > destinationIndex) {
          // INCREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
          console.log("todo to be incremented:", todo);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "tasks",
            `${todo?.uid}`
          );
          batch.update(taskDocRef, { index: increment(1) });
        }
      });
    } else if (newStatus === 2) {
      console.log("Destination Column is doing");
      doings?.map((doing: any, index: number) => {
        if (index > destinationIndex) {
          // INCREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
          console.log("doing to be incremented:", doing);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "tasks",
            `${doing?.uid}`
          );
          batch.update(taskDocRef, { index: increment(1) });
        }
      });
    } else if (newStatus === 3) {
      console.log("Destination Column is done");
      dones?.map((done: any, index: number) => {
        if (index > destinationIndex) {
          // INCREMENT THE INDEX OF EACH TASK THAT FITS THIS CRITERIA
          console.log("done to be incremented:", done);
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${boardId}`,
            "tasks",
            `${done?.uid}`
          );
          batch.update(taskDocRef, { index: increment(1) });
        }
      });
    }

    await batch.commit();
  };

  return (
    <div
      onClick={() => {
        setShowAddTaskModal(false);
        setShowEditTaskModal(false);
      }}
      className="flex justify-center text-white h-screen overflow-auto"
    >
      <SideNav
        boards={boards}
        setBoards={setBoards}
        boardId={boardId}
        setBoardId={setBoardId}
      />
      {/* Main */}
      <main className="w-4/5">
        {/* Top Settings */}
        <section className="h-[10%] min-w-[500px] p-4 flex justify-between items-center bg-darkGray">
          {/* <h1 className="text-2xl">
            {(activeBoard && activeBoard?.[0]?.title) || "Future Board Name 🤓"}
          </h1> */}
          <input
            className="text-2xl bg-transparent cursor-pointer outline-none"
            type="text"
            value={
              (activeBoard && activeBoard?.[0]?.title) || "Future Board Name 🤓"
            }
            onChange={
              user
                ? // If user is authenticated, update Firestore
                  (e) => {
                    updateBoardName(activeBoard?.[0]?.uid, e.target.value);
                  }
                : // If user is not authenticated, update localStorage
                  (e) => {
                    const newBoardList: {}[] = [];
                    boards.map((b: BoardSchema) => {
                      b.uid === activeBoard?.[0]?.id
                        ? newBoardList.push({
                            ...activeBoard?.[0],
                            title: e.target.value,
                          })
                        : newBoardList.push(b);
                    });
                    localStorage.setItem(
                      "boards",
                      JSON.stringify(newBoardList)
                    );
                    setBoards(newBoardList);
                    setBoardId(activeBoard?.[0]?.id);
                  }
            }
          />
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={(e) => {
                handleAddNewTaskBtn(e);
              }}
              className="px-4 purpleBtn"
            >
              + Add New Task
            </button>
            {/* Delete Board Btn */}
            <svg
              onClick={() => handleDeleteBoard(boardId)}
              className="w-10 h-10 p-2 text-fontSecondary rounded cursor-pointer hover:bg-darkBlue"
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
        </section>
        {/* Main content */}
        <DragDropContext onDragEnd={onDragEnd}>
          {/* overflow-x-auto overflow-hidden */}
          <section className="h-[90%] bg-darkBlue p-5 flex justify-start items-start gap-6 ">
            {/* First Column */}
            <div className="min-w-[250px] max-w-[350px]">
              {/* Column Title Container */}
              <div className="flex justify-start items-center gap-2 mb-6 text-sm">
                {/* Colorful circle */}
                <div className="h-4 w-4 bg-todoColors-brightBlue rounded-full"></div>
                {/* Column Title */}
                <h3 className="uppercase text-fontSecondary font-bold">
                  Todo ({todoCount})
                </h3>
              </div>
              {/* Task Container */}
              {/* <Droppable droppableId="todoList"> */}
              <Droppable droppableId="1">
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
                      {todoTasks?.map((task: any, index: number) => {
                        // if (task.status === "1") {
                        // Number of checked subtasks
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
                        // }
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
            {/* Second Column */}
            <div className="min-w-[250px] max-w-[350px]">
              {/* Column Title Container */}
              <div className="flex justify-start items-center gap-2 mb-6 text-sm">
                {/* Colorful circle */}
                <div className="h-4 w-4 bg-todoColors-violet rounded-full"></div>
                {/* Column Title */}
                <h3 className="uppercase text-fontSecondary font-bold">
                  Doing ({doingCount})
                </h3>
              </div>
              {/* Task Container */}
              {/* <Droppable droppableId="doingList"> */}
              <Droppable droppableId="2">
                {(provided: DroppableProvided) => {
                  return (
                    <div
                      className="flex flex-col justify-start items-center gap-4 rounded-md h-screen"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {doingTasks?.map((task: any, index: number) => {
                        // if (task.status === "2") {
                        // Number of checked subtasks
                        let checkedNumber = 0;
                        task.subtasks.map((subtask: any) => {
                          subtask.checked && checkedNumber++;
                        });
                        return (
                          <Draggable
                            draggableId={task.uid}
                            key={task.uid}
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
                        // }
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
            {/* Third Column */}
            <div className="min-w-[250px] max-w-[350px]">
              {/* Column Title Container */}
              <div className="flex justify-start items-center gap-2 mb-6 text-sm">
                {/* Colorful circle */}
                <div className="h-4 w-4 bg-todoColors-brightGreen rounded-full"></div>
                {/* Column Title */}
                <h3 className="uppercase text-fontSecondary font-bold">
                  Done ({doneCount})
                </h3>
              </div>
              {/* Task Container */}
              {/* <Droppable droppableId="doneList"> */}
              <Droppable droppableId="3">
                {(provided: DroppableProvided, snapshot: any) => {
                  return (
                    <div
                      className="flex flex-col justify-start items-center gap-4 rounded-md h-screen"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {doneTasks?.map((task: any, index: number) => {
                        // if (task.status === "3") {
                        // Number of checked subtasks
                        let checkedNumber = 0;
                        task.subtasks.map((subtask: any) => {
                          subtask.checked && checkedNumber++;
                        });
                        return (
                          <Draggable
                            draggableId={task.uid}
                            key={task.uid}
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
                        // }
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
            {/* Add New Column btn */}
            <div className="min-w-[250px] bg-veryDarkGray mt-11 h-5/6 flex justify-center items-center cursor-pointer rounded-md hover:bg-opacity-50">
              <h2 className="mb-56 text-2xl text-fontSecondary font-bold">
                + New Column
              </h2>
            </div>
          </section>
        </DragDropContext>
      </main>
      {showAddTaskModal && (
        <AddNewTaskModal
          boardId={boardId}
          setShowAddTaskModal={setShowAddTaskModal}
          todoTasksArray={todoTasksArray}
          doingTasksArray={doingTasksArray}
          doneTasksArray={doneTasksArray}
        />
      )}
      {showEditTaskModal && (
        <EditTaskModal
          boardId={boardId}
          taskId={taskId}
          setShowEditTaskModal={setShowEditTaskModal}
        />
      )}
    </div>
  );
};

export default Home;
