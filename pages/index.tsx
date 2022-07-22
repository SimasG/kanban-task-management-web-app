import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
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
import useFetchFsTasksTest from "../lib/hooks/useFetchFsTasksTest";

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
  // What type is a Firebase timestamp?
  createdAt: any;
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
  // const testFsTasks = useFetchFsTasksTest(user?.uid, boardId);

  // console.log("testFsTasks:", testFsTasks);
  // console.log("tasks:", tasks);

  // Separating Tasks array into arrays of Tasks for different columns -> to ensure each column's Tasks are zero-indexed
  const todoTasksArray = fsTasks?.filter((task: any) => task?.status === "1");
  const doingTasksArray = fsTasks?.filter((task: any) => task?.status === "2");
  const doneTasksArray = fsTasks?.filter((task: any) => task?.status === "3");

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
      setTodoTasks(todos || todoTasksArray);
      setDoingTasks(doings || doingTasksArray);
      setDoneTasks(dones || doneTasksArray);
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
    task.status === "1" && todoCount++;
    task.status === "2" && doingCount++;
    task.status === "3" && doneCount++;
  });

  let todos = todoTasks;
  let doings = doingTasks;
  let dones = doneTasks;

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

    if (source.droppableId === "todoList") {
      add = todos[source.index];
      todos.splice(source.index, 1);
    } else if (source.droppableId === "doingList") {
      add = doings[source.index];
      doings.splice(source.index, 1);
    } else if (source.droppableId === "doneList") {
      add = dones[source.index];
      dones.splice(source.index, 1);
    }

    if (destination.droppableId === "todoList") {
      todos.splice(destination.index, 0, add);
      updateTask(todos[destination.index], todos[destination.index].uid, "1");
    } else if (destination.droppableId === "doingList") {
      doings.splice(destination.index, 0, add);
      updateTask(doings[destination.index], doings[destination.index].uid, "2");
    } else if (destination.droppableId === "doneList") {
      dones.splice(destination.index, 0, add);
      updateTask(dones[destination.index], dones[destination.index].uid, "3");
    }

    setTodoTasks(todos);
    setDoingTasks(doings);
    setDoneTasks(dones);
  };

  const updateTask = async (
    updatedTask: any,
    updatedTaskId: string,
    status: string
  ) => {
    const taskDocRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${boardId}`,
      "tasks",
      `${updatedTaskId}`
    );

    await setDoc(taskDocRef, {
      // Using type guard to ensure that we're always spreading an object
      ...(typeof updatedTask === "object" ? updatedTask : {}),
      status: status,
      updatedAt: Timestamp.fromDate(new Date()),
    });
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
              <Droppable droppableId="todoList">
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
              <Droppable droppableId="doingList">
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
              <Droppable droppableId="doneList">
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
