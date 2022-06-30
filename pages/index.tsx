import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import AddNewTaskModal from "../components/AddNewTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import SideNav from "../components/SideNav";
import { UserContext } from "../lib/context";
import useFetchFirestoreData from "../lib/hooks/useFetchFsData";

type LocalStorageBoardSchema = {
  boards: {
    title: string;
    id: string | null | undefined;
  }[];
};

type BoardSchema = {
  title: string;
  id: string | null | undefined;
};

const Home: NextPage = () => {
  // Pre-fetching data
  const user = useContext(UserContext);
  const firestoreData = useFetchFirestoreData(user?.uid);
  useEffect(() => {
    setLocalStorageBoards(JSON.parse(localStorage.getItem("boards") || ""));
  }, []);
  const [localStorageBoards, setLocalStorageBoards] = useState<
    // ** Change "any" later
    LocalStorageBoardSchema | null | any
  >(null);

  // States
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [id, setId] = useState<string | null | undefined>(null);
  // ** Putting "any" for now
  const [activeBoard, setActiveBoard] = useState<any | null>(null);

  let data: any;
  user ? (data = firestoreData) : (data = localStorageBoards);

  // ** useEffects
  // Setting default active Board from localStorage
  useEffect(() => {
    if (user) return;
    if (!localStorageBoards || localStorageBoards?.length === 0) return;
    if (id) return;
    setId(localStorageBoards?.[0].id);
  }, [user, localStorageBoards]);

  // Setting a current active Board
  useEffect(() => {
    if (id) {
      const currentBoard = data?.filter(
        (board: BoardSchema) => board.id === id
      );
      setActiveBoard(currentBoard);
    }
  }, [id]);

  // Buttons
  const handleAddNewTaskBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowAddTaskModal(true);
  };

  const handleEditTask = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowEditTaskModal(true);
  };

  const handleDeleteBoard = (id: string | null | undefined) => {
    // Deleting Board from localStorage
    if (!user) {
      const lsData = JSON.parse(localStorage.getItem("boards") || "");
      const newData = lsData.filter((board: BoardSchema) => board.id !== id);
      localStorage.setItem("boards", JSON.stringify(newData));
      setLocalStorageBoards(newData);
    } else {
      // Deleting Board from Firestore
    }
  };

  return (
    <div
      onClick={() => {
        setShowAddTaskModal(false);
        setShowEditTaskModal(false);
      }}
      className="flex justify-center text-white h-screen overflow-x-hidden"
    >
      <SideNav
        localStorageBoards={localStorageBoards}
        setLocalStorageBoards={setLocalStorageBoards}
        id={id}
        setId={setId}
      />
      {/* Main */}
      <main className="w-4/5">
        {/* Top Settings */}
        <section className="h-[10%] min-w-[500px] p-4 flex justify-between items-center bg-darkGray">
          <h1 className="text-2xl">
            {activeBoard?.[0]?.title || "Future Board Name 🤓"}
            {/* {activeBoard[0]?.title || "Future Board Name 🤓"} */}
          </h1>
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
              onClick={() => handleDeleteBoard(id)}
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
        <section className="h-[90%] bg-darkBlue p-5 flex justify-start items-start gap-6 overflow-x-auto overflow-hidden">
          {/* First Column */}
          <div className="min-w-[250px] max-w-[350px]">
            {/* Column Title Container */}
            <div className="flex justify-start items-center gap-2 mb-6 text-sm">
              {/* Colorful circle */}
              <div className="h-4 w-4 bg-todoColors-brightBlue rounded-full"></div>
              {/* Column Title */}
              <h3 className="uppercase text-fontSecondary font-bold">
                Todo (4)
              </h3>
            </div>
            {/* Task Container */}
            <div className="flex flex-col justify-start items-center gap-4">
              {/* Single Task Container */}
              <div
                onClick={(e) => {
                  handleEditTask(e);
                }}
                className="task"
              >
                <h2 className="task-title">Example todo for xyz</h2>
                <span className="task-body">0 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for zyx</h2>
                <span className="task-body">0 of 7 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for abc</h2>
                <span className="task-body">1 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for cba</h2>
                <span className="task-body">2 of 5 subtasks</span>
              </div>
            </div>
          </div>
          {/* Second Column */}
          <div className="min-w-[250px] max-w-[350px]">
            {/* Column Title Container */}
            <div className="flex justify-start items-center gap-2 mb-6 text-sm">
              {/* Colorful circle */}
              <div className="h-4 w-4 bg-todoColors-violet rounded-full"></div>
              {/* Column Title */}
              <h3 className="uppercase text-fontSecondary font-bold">
                Doing (4)
              </h3>
            </div>
            {/* Task Container */}
            <div className="flex flex-col justify-start items-center gap-4">
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for xyz</h2>
                <span className="task-body">0 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for zyx</h2>
                <span className="task-body">0 of 7 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for abc</h2>
                <span className="task-body">1 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for cba</h2>
                <span className="task-body">2 of 5 subtasks</span>
              </div>
            </div>
          </div>
          {/* Third Column */}
          <div className="min-w-[250px] max-w-[350px]">
            {/* Column Title Container */}
            <div className="flex justify-start items-center gap-2 mb-6 text-sm">
              {/* Colorful circle */}
              <div className="h-4 w-4 bg-todoColors-brightGreen rounded-full"></div>
              {/* Column Title */}
              <h3 className="uppercase text-fontSecondary font-bold">
                Done (4)
              </h3>
            </div>
            {/* Task Container */}
            <div className="flex flex-col justify-start items-center gap-4">
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for xyz</h2>
                <span className="task-body">0 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for zyx</h2>
                <span className="task-body">0 of 7 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for abc</h2>
                <span className="task-body">1 of 3 subtasks</span>
              </div>
              {/* Single Task Container */}
              <div className="task">
                <h2 className="task-title">Example todo for cba</h2>
                <span className="task-body">2 of 5 subtasks</span>
              </div>
            </div>
          </div>
          {/* Add New Column btn */}
          <div className="min-w-[250px] bg-veryDarkGray mt-11 h-5/6 flex justify-center items-center cursor-pointer rounded-md hover:bg-opacity-50">
            <h2 className="mb-56 text-2xl text-fontSecondary font-bold">
              + New Column
            </h2>
          </div>
        </section>
      </main>
      {showAddTaskModal && <AddNewTaskModal />}
      {showEditTaskModal && <EditTaskModal />}
    </div>
  );
};

export default Home;
