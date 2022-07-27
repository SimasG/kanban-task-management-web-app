import { doc, FieldValue, updateDoc } from "firebase/firestore";
import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import AddNewTaskModal from "../components/AddNewTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import Main from "../components/Main/Main";
import SideNav from "../components/SideNav";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import useFetchFsBoards from "../lib/hooks/useFetchFsBoards";
import useFetchTasksCollectionGroup from "../lib/hooks/useFetchFsTasks";
import { BoardSchema } from "../lib/types";

const Home: NextPage = () => {
  // ** Fetching Data
  const user = useContext(UserContext);
  const fsBoards = useFetchFsBoards(user?.uid);

  // ** STATES
  const [boards, setBoards] = useState<
    // ** Change "any" later -> change it once the data schema is more clear
    BoardSchema[] | null | any
  >(null);
  const [tasks, setTasks] = useState<any>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [boardId, setBoardId] = useState<string | null | undefined>(null);
  const [taskId, setTaskId] = useState<string | null | undefined>(null);

  // Fetching all Tasks of selected Board
  const fsTasks: any = useFetchTasksCollectionGroup(boardId);

  // Setting main state either from localStorage or Firestore
  useEffect(() => {
    if (!user) {
      // If localStorage is empty, do not try to set the main state from it
      if (localStorage.getItem("boards") || "" !== "") {
        setBoards(JSON.parse(localStorage.getItem("boards") || ""));
        setBoardId(JSON.parse(localStorage.getItem("boards") || "")?.[0]?.id);
      }
      // get "tasks" (& "subtasks"?) as well later..
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
      console.log("useEffect shit ran");
    }
  }, [fsBoards, fsTasks, user]);

  // Separating Tasks array into arrays of Tasks for different columns -> to ensure each column's Tasks are zero-indexed
  let todos = tasks?.filter((task: any) => task?.status === 1);
  let doings = tasks?.filter((task: any) => task?.status === 2);
  let dones = tasks?.filter((task: any) => task?.status === 3);

  const activeBoard = boards?.filter(
    (board: BoardSchema) => board.uid === boardId
  );

  const updateBoardName = async (uid: string, newName: string) => {
    const ref = doc(db, "users", `${user?.uid}`, "boards", uid);
    await updateDoc(ref, {
      title: newName,
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
        updateBoardName={updateBoardName}
      />
      {/* Main */}
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
      />
      {showAddTaskModal && (
        <AddNewTaskModal
          boardId={boardId}
          setShowAddTaskModal={setShowAddTaskModal}
          todoTasksArray={todos}
          doingTasksArray={doings}
          doneTasksArray={dones}
        />
      )}
      {showEditTaskModal && (
        <EditTaskModal
          boardId={boardId}
          taskId={taskId}
          setShowEditTaskModal={setShowEditTaskModal}
          tasks={tasks}
        />
      )}
    </div>
  );
};

export default Home;
