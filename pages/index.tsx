import {
  collectionGroup,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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
import useFetchFsSharedBoards from "../lib/hooks/useFetchFsSharedBoards";
import useFetchFsUsers from "../lib/hooks/useFetchFsUsers";

const Home: NextPage = () => {
  const user = useContext(UserContext);
  const boards: any = useFetchFsBoards(user?.uid);

  // ** Why am I getting a promise instead of a value? In the useFetch hook, I got the value.
  const sharedBoards = useFetchFsSharedBoards();
  console.log("sharedBoards in index:", sharedBoards);

  // let sharedSharedBoards: any = [];
  // sharedBoards.then((values) => {
  //   sharedSharedBoards = values;
  // });
  // console.log("sharedSharedBoards:", sharedSharedBoards);

  const users = useFetchFsUsers();

  // ** STATES
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [boardId, setBoardId] = useState<string | null | undefined>(null);
  const [taskId, setTaskId] = useState<string | null | undefined>(null);
  // const [fetching, setFetching] = useState(false);
  // SideNav
  const [isOpen, setIsOpen] = useState(true);

  // const [sharedBoards, setSharedBoards] = useState<any>([]);

  let activeBoard: any;

  // ** Why am I getting an infinite loop here?
  // useEffect(() => {
  //   if (!user?.email) return;

  //   const fetchFsSharedBoards = async () => {
  //     const sharedBoardsQuery = query(
  //       collectionGroup(db, "boards"),
  //       where("collaborators", "array-contains-any", [`${user?.email}`])
  //     );

  //     const fetchedSharedBoards = (await getDocs(sharedBoardsQuery)).docs.map(
  //       (doc: any) => doc.data()
  //     );

  //     setSharedBoards(fetchedSharedBoards);
  //   };

  //   fetchFsSharedBoards();
  // }, [sharedBoards, user?.email, setSharedBoards]);

  // console.log("sharedBoards in index:", sharedBoards);

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
              sharedBoards={sharedBoards}
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
        <Login users={users} />
      )}
    </>
  );
};

export default Home;
