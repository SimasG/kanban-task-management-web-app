import {
  doc,
  DocumentData,
  DocumentReference,
  increment,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import AddNewTaskModal from "../components/AddNewTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import EditCollaboratorsModal from "../components/EditCollaboratorsModal";
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
import toast from "react-hot-toast";
import { BoardSchema, SharedBoardRef } from "../lib/types";

const Home: NextPage = () => {
  const user = useContext(UserContext);
  // ** How could I change "users" & "boards" type from "DocumentData[] | undefined" (coming from
  // ** useCollectionData hook) to "UserSchema[] | undefined" "BoardSchema[] | undefined" respectively?
  const users: any = useFetchFsUsers(); // *TypeScript*
  const boards: any = useFetchFsBoards(user?.uid); // Personal Boards // *TypeScript*
  const sharedBoards: any = useFetchFsSharedBoards(); // Boards are fetched from the *owner's* Firebase doc path
  const allBoards: any = boards?.concat(sharedBoards); // *TypeScript* why "BoardSchema[]" throws errors + why "BoardSchema" doesn't?

  // ** STATES
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditCollabsModal, setShowEditCollabsModal] = useState(false);
  const [boardId, setBoardId] = useState<string | null | undefined>(null);
  const [taskId, setTaskId] = useState<string | null | undefined>(null);
  // const [fetching, setFetching] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // SideNav

  // Creating shared Board Ids array to identify whether the Board manipulated is personal or shared
  let sharedBoardIds: (string | null | undefined)[] = [];
  sharedBoards?.map((board: BoardSchema) => {
    sharedBoardIds.push(board?.uid);
  });

  // Is it better to have these as a separate state, or smth else altogether?
  let activeBoard: BoardSchema;
  activeBoard = allBoards?.find((board: BoardSchema) => board?.uid === boardId);

  // Setting activeBoard amongst personal Boards
  useEffect(() => {
    // setFetching(true);
    if (boards?.length >= 0 && activeBoard) return;
    setBoardId(boards?.[0]?.uid);
    // setFetching(false);
  }, [activeBoard, boards]);

  // Setting activeBoard amongst shared Boards
  useEffect(() => {
    if (boards?.length > 0) return;
    setBoardId(sharedBoards?.[0]?.uid);
  }, [boards, sharedBoards]);

  // ** Do these hooks re-fetch *all* the documents on each re-render (not just the new/updated ones)?
  const columns: any = useFetchFsColumns(boardId, users); // *TypeScript*
  const tasks: any = useFetchFsTasks(boardId, users); // *TypeScript*

  const updateBoardName = async (uid: string, newName: string) => {
    if (newName === "") return;
    let boardDocRef: DocumentReference<DocumentData>; // *TypeScript* Should I even include "<DocumentData>"?

    if (sharedBoardIds.includes(boardId)) {
      // Updating shared Board Name
      // Finding Current User (Invitee) Firebase Doc
      const currentUser = users?.find(
        (currentUser: any) => currentUser.uid === user?.uid
      );

      // Find User Id (Inviter) of the Shared Board
      const sharedBoardRef = currentUser?.sharedBoardRefs?.find(
        (board: any) => board?.board === boardId
      );
      boardDocRef = doc(db, "users", `${sharedBoardRef?.user}`, "boards", uid);
    } else {
      // Updating personal Board Name
      boardDocRef = doc(db, "users", `${user?.uid}`, "boards", uid);
    }

    await updateDoc(boardDocRef, {
      title: newName,
    });
  };

  let handleDeleteBoard: (boardId: string | null | undefined) => Promise<void>; // *TypeScript* is there a way to export this type declaration instead of writing it here?
  handleDeleteBoard = async (boardId: string | null | undefined) => {
    const batch = writeBatch(db);
    // 1. Delete Board
    const boardDocRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${boardId}`
    );
    // If the first Board in the array is deleted, setId to the second Board (which will become the
    // first once the first one is removed from FS). Else, remove the first Board in the array.
    boards?.[0]?.uid === boardId
      ? setBoardId(boards?.[1]?.uid)
      : setBoardId(boards?.[0]?.uid);
    batch.delete(boardDocRef);

    // 2. Delete Columns in the Board
    const columnsToDelete = columns?.filter(
      (column: any) => column?.board === boardId
    );
    columnsToDelete?.map((column: any) => {
      const columnDocRef = doc(
        db,
        "users",
        `${user?.uid}`,
        "columns",
        `${column?.uid}`
      );
      batch.delete(columnDocRef);
    });

    // 3. Decrement indexes of Boards that come after deleted Board
    boards?.map((board: any) => {
      if (board?.index <= activeBoard?.index) return;
      const boardDocRef = doc(
        db,
        "users",
        `${user?.uid}`,
        "boards",
        `${board?.uid}`
      );
      batch.update(boardDocRef, { index: increment(-1) });
    });

    // 4. Delete Board reference from sharedBoardRefs array for every invitee (if there are invitees)
    users?.map((user: any) => {
      // *TypeScript* why can't "user" type be "UserSchema"?
      user?.sharedBoardRefs?.map((sharedBoardRef: SharedBoardRef) => {
        if (!sharedBoardRef?.board.includes(activeBoard?.uid)) return;

        const filteredSharedBoardRefs = user?.sharedBoardRefs?.filter(
          (sharedBoardRef: SharedBoardRef) =>
            sharedBoardRef?.board !== activeBoard?.uid
        );

        const userDocRef = doc(db, "users", `${user?.uid}`);
        batch.update(userDocRef, {
          ...(typeof user === "object" && user),
          sharedBoardRefs: filteredSharedBoardRefs,
        });
      });
    });

    toast.success(`${activeBoard?.title} has been deleted`);

    await batch.commit();
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
            <SideNav
              boards={boards}
              boardId={boardId}
              setBoardId={setBoardId}
              updateBoardName={updateBoardName}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              sharedBoards={sharedBoards}
              handleDeleteBoard={handleDeleteBoard}
              activeBoard={activeBoard}
              users={users}
              setShowEditCollabsModal={setShowEditCollabsModal}
            />
            <Main
              activeBoard={activeBoard}
              boardId={boardId}
              tasks={tasks}
              setTaskId={setTaskId}
              setShowAddTaskModal={setShowAddTaskModal}
              setShowEditTaskModal={setShowEditTaskModal}
              updateBoardName={updateBoardName}
              columns={columns}
              isOpen={isOpen}
              setShowShareModal={setShowShareModal}
              sharedBoardIds={sharedBoardIds}
              users={users}
              handleDeleteBoard={handleDeleteBoard}
              allBoards={allBoards}
            />
            {showAddTaskModal && (
              <AddNewTaskModal
                boardId={boardId}
                setShowAddTaskModal={setShowAddTaskModal}
                tasks={tasks}
                columns={columns}
                sharedBoardIds={sharedBoardIds}
                users={users}
              />
            )}
            {showEditTaskModal && (
              <EditTaskModal
                boardId={boardId}
                taskId={taskId}
                setShowEditTaskModal={setShowEditTaskModal}
                tasks={tasks}
                columns={columns}
                sharedBoardIds={sharedBoardIds}
                users={users}
              />
            )}
            {showShareModal && (
              <ShareModal
                setShowShareModal={setShowShareModal}
                boardId={boardId}
                users={users}
                activeBoard={activeBoard}
              />
            )}
            {showEditCollabsModal && (
              <EditCollaboratorsModal
                setShowEditCollabsModal={setShowEditCollabsModal}
                users={users}
                activeBoard={activeBoard}
                boardId={boardId}
              />
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
