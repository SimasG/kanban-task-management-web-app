import { doc, updateDoc } from "firebase/firestore";
import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import AddNewTaskModal from "../components/AddNewTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import Main from "../components/Main/Main";
import SideNav from "../components/SideNav";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import useFetchFsBoards from "../lib/hooks/useFetchFsBoards";
import useFetchFsColumns from "../lib/hooks/useFetchFsColumns";
import useFetchTasksCollectionGroup from "../lib/hooks/useFetchFsTasks";
import { BoardSchema } from "../lib/types";
import Login from "./login";

const Home: NextPage = () => {
  const user = useContext(UserContext);
  const fsBoards = useFetchFsBoards(user?.uid);

  // ** STATES
  const [boards, setBoards] = useState<
    // ** Change "any" later -> change it once the data schema is more clear
    BoardSchema[] | null | any
  >(null);
  const [columns, setColumns] = useState<any>(null);
  const [tasks, setTasks] = useState<any>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [boardId, setBoardId] = useState<string | null | undefined>(null);
  const [taskId, setTaskId] = useState<string | null | undefined>(null);
  // SideNav
  const [isOpen, setIsOpen] = useState(false);

  // Fetching all Tasks of selected Board
  const fsTasks: any = useFetchTasksCollectionGroup(boardId);
  const fsColumns = useFetchFsColumns(boardId);

  let activeBoard: any;

  // Setting main state either from localStorage or Firestore
  useEffect(() => {
    // Ensuring that I only set the main state from Firestore once the data has been fetched (async protection)
    if (!fsBoards) return;
    setBoards(fsBoards);
    if (!activeBoard && fsBoards?.length !== 0) {
      setBoardId(fsBoards?.[0]?.uid);
    }
    if (!fsColumns) return;
    setColumns(fsColumns);
    if (!fsTasks) return;
    setTasks(fsTasks);
  }, [activeBoard, fsBoards, fsColumns, fsTasks]);

  // ** How can I fix the "ReferenceError: localStorage is not defined" error?
  // useEffect(() => {
  //   if (!localStorage.theme) return;
  //   if (
  //     localStorage.theme === "dark" ||
  //     (!("theme" in localStorage) &&
  //       window.matchMedia("(prefers-color-scheme: dark)").matches)
  //   ) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, [localStorage.theme]);

  activeBoard = boards?.filter((board: BoardSchema) => board.uid === boardId);

  const updateBoardName = async (uid: string, newName: string) => {
    const ref = doc(db, "users", `${user?.uid}`, "boards", uid);
    await updateDoc(ref, {
      title: newName,
    });
  };

  return (
    <>
      {user ? (
        <div
          onClick={() => {
            setShowAddTaskModal(false);
            setShowEditTaskModal(false);
          }}
          //       className="flex justify-center h-screen overflow-auto"
          className="flex justify-center h-screen w-screen"
        >
          <SideNav
            boards={boards}
            setBoards={setBoards}
            boardId={boardId}
            setBoardId={setBoardId}
            updateBoardName={updateBoardName}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
          <Main
            activeBoard={activeBoard}
            boards={boards}
            setBoards={setBoards}
            boardId={boardId}
            setBoardId={setBoardId}
            tasks={tasks}
            setTaskId={setTaskId}
            setShowAddTaskModal={setShowAddTaskModal}
            setShowEditTaskModal={setShowEditTaskModal}
            updateBoardName={updateBoardName}
            columns={columns}
            setColumns={setColumns}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
          {showAddTaskModal && (
            <AddNewTaskModal
              boardId={boardId}
              setShowAddTaskModal={setShowAddTaskModal}
              tasks={tasks}
              columns={columns}
            />
          )}
          {showEditTaskModal && (
            <EditTaskModal
              boardId={boardId}
              taskId={taskId}
              setShowEditTaskModal={setShowEditTaskModal}
              tasks={tasks}
              columns={columns}
            />
          )}
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Home;
