import { doc, updateDoc } from "firebase/firestore";
import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import AddNewTaskModal from "../components/AddNewTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import Main from "../components/Main/Main";
import ShareModal from "../components/ShareModal";
import SideNav from "../components/SideNav";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import useFetchFsBoards from "../lib/hooks/useFetchFsBoards";
import useFetchFsColumns from "../lib/hooks/useFetchFsColumns";
import useFetchFsTasks from "../lib/hooks/useFetchFsTasks";
import Login from "./login";
import { PropagateLoader } from "react-spinners";

const Home: NextPage = () => {
  const user = useContext(UserContext);
  const boards: any = useFetchFsBoards(user?.uid);

  // ** STATES
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [boardId, setBoardId] = useState<string | null | undefined>(null);
  const [taskId, setTaskId] = useState<string | null | undefined>(null);
  // SideNav
  const [isOpen, setIsOpen] = useState(true);
  const [fetching, setFetching] = useState(false);

  let activeBoard: any;

  useEffect(() => {
    // setFetching(true);
    if (activeBoard?.length > 0 && boards?.length > 0) return;
    setBoardId(boards?.[0]?.uid);
    // setFetching(false);
  }, [activeBoard, boards]);

  // ** Do these hooks re-fetch *all* the documents on each re-render (not just the new/updated ones)?
  const columns: any = useFetchFsColumns(boardId);
  const tasks: any = useFetchFsTasks(boardId);

  activeBoard = boards?.filter((board: any) => board?.uid === boardId);

  const updateBoardName = async (uid: string, newName: string) => {
    if (newName === "") return;
    const boardDocRef = doc(db, "users", `${user?.uid}`, "boards", uid);
    await updateDoc(boardDocRef, {
      title: newName,
    });
  };

  return (
    <>
      {user ? (
        <>
          {/* {fetching && (
            <div className="flex h-[92vh] w-full items-center justify-center">
              <PropagateLoader color={"#E9795D"} loading={fetching} size={25} />
            </div>
          )} */}
          {/* {!fetching && ( */}
          <div
            onClick={() => {
              setShowAddTaskModal(false);
              setShowEditTaskModal(false);
            }}
            className="flex justify-center h-screen w-screen"
          >
            {/* <div>DEBUGGING</div> */}
            <SideNav
              boards={boards}
              boardId={boardId}
              setBoardId={setBoardId}
              updateBoardName={updateBoardName}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
            <Main
              activeBoard={activeBoard}
              boards={boards}
              boardId={boardId}
              setBoardId={setBoardId}
              tasks={tasks}
              setTaskId={setTaskId}
              setShowAddTaskModal={setShowAddTaskModal}
              setShowEditTaskModal={setShowEditTaskModal}
              updateBoardName={updateBoardName}
              columns={columns}
              isOpen={isOpen}
              setShowShareModal={setShowShareModal}
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
            {showShareModal && (
              <ShareModal setShowShareModal={setShowShareModal} />
            )}
          </div>
          {/* )} */}
        </>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Home;
