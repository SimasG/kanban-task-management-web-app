import { signOut } from "firebase/auth";
import { doc, increment, Timestamp, writeBatch } from "firebase/firestore";
import Image from "next/image";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { TbLayoutBoardSplit } from "react-icons/tb";
import { BiRightArrowAlt, BiLeftArrowAlt } from "react-icons/bi";
import { HiSun } from "react-icons/hi";
import { IoMdMoon } from "react-icons/io";
import { UserContext } from "../lib/context";
import { auth, db } from "../lib/firebase";
import { v4 as uuidv4 } from "uuid";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import { defaultColumns } from "../lib/helpers";
import Link from "next/link";

type SideNavProps = {
  boards: any;
  boardId: string | null | undefined;
  setBoardId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  updateBoardName: (uid: string, newName: string) => Promise<void>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SideNav = ({
  boards,
  boardId,
  setBoardId,
  updateBoardName,
  isOpen,
  setIsOpen,
}: SideNavProps) => {
  const user = useContext(UserContext);

  const signOutUser = () => {
    signOut(auth).then(() => toast.success("Logged out!"));
  };

  // ** FIXED
  const handleCreateNewBoard = async () => {
    // Creating new Board in Firestore
    const batch = writeBatch(db);
    const uuid = uuidv4();
    const boardRef = doc(db, "users", `${user?.uid}`, "boards", `${uuid}`);
    batch.set(boardRef, {
      title: "New Board",
      uid: uuid,
      createdAt: Timestamp.fromDate(new Date()),
      index: boards?.length,
    });
    setBoardId(uuid);

    // Create 3 default Columns
    defaultColumns?.map((column: any) => {
      const columnRef = doc(
        db,
        "users",
        `${user?.uid}`,
        "columns",
        `${column?.uid}`
      );
      batch.set(columnRef, {
        uid: column?.uid,
        index: column?.index,
        status: column?.status,
        title: column?.title,
        color: column?.color,
        board: uuid,
      });
    });
    await batch.commit();
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    let add;
    let newBoards = boards;

    add = newBoards[source.index];

    // Removing Board from the array at source.index
    newBoards.splice(source.index, 1);

    // Adding the same Board in the array at destination.index
    newBoards.splice(destination.index, 0, add);

    // Reflecting UI changes in Firestore
    updateBoardsIndex(
      newBoards[destination.index].uid,
      source.index,
      destination.index
    );
  };

  const updateBoardsIndex = async (
    updatedBoardId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const batch = writeBatch(db);

    // ** Changing indexes of Boards affected
    boards?.map((board: any) => {
      if (board.uid === boardId) return;
      if (destinationIndex > sourceIndex) {
        // Decrement Boards
        if (board.index > sourceIndex && board.index <= destinationIndex) {
          // DECREMENT THE INDEX OF EACH BOARD THAT FITS THIS CRITERIA
          const boardDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${board?.uid}`
          );
          batch.update(boardDocRef, { index: increment(-1) });
        }
      } else if (destinationIndex < sourceIndex) {
        // Increment Boards
        if (board.index < sourceIndex && board.index >= destinationIndex) {
          // INCREMENT THE INDEX OF EACH BOARD THAT FITS THIS CRITERIA
          const boardDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${board?.uid}`
          );
          batch.update(boardDocRef, { index: increment(1) });
        }
      }
    });

    // ** Changing index of dragged Board
    const boardDocRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "boards",
      `${updatedBoardId}`
    );
    batch.update(boardDocRef, {
      index: destinationIndex,
    });

    await batch.commit();
  };

  const toggleTheme = () => {
    const htmlDoc = document?.querySelector("html");
    if (htmlDoc?.classList.contains("dark")) {
      htmlDoc?.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      htmlDoc?.classList.add("dark");
      localStorage.theme = "dark";
    }
  };

  return (
    <>
      {isOpen ? (
        <div
          onClick={() => setIsOpen(false)}
          className="absolute bg-black bg-opacity-50 top-0 left-0 w-full h-screen flex justify-center items-center rounded-r sm:static sm:bg-transparent sm:bg-opacity-100 sm:inset-auto sm:block sm:w-[40%] md:w-[35%] lg:w-[25%] xl:w-[20%]"
        >
          <nav
            onClick={(e) => e.stopPropagation()}
            className="fixed h-screen top-0 left-0 w-[60%] sm:w-[40%] md:w-[35%] lg:w-[25%] xl:w-[20%] bg-backgroundColorMenu dark:bg-darkGray pr-4 py-4 flex flex-col justify-between items-center"
          >
            {/* Logo container */}
            <Link href="/">
              <a className="pl-4 flex justify-between items-center gap-2 mb-8 h-[52px] w-[100%]">
                {/* Logo + Logo Title Container */}
                <div className="flex justify-center items-center gap-2">
                  <div className="flex justify-between items-center gap-[2px]">
                    <div className="w-[5px] h-6 bg-fontTertiary rounded-md"></div>
                    <div className="w-[6px] h-6 bg-fontTertiary rounded-md opacity-75"></div>
                    <div className="w-[6px] h-6 bg-fontTertiary rounded-md opacity-50"></div>
                  </div>
                  <h1 className="text-3xl text-fontPrimary dark:text-fontPrimaryDark">
                    kanban
                  </h1>
                </div>
                {/* Logo */}
                <BiLeftArrowAlt
                  onClick={() => setIsOpen(false)}
                  className="h-10 w-10 ml-auto rounded text-darkBlue dark:text-backgroundColorMain hover:bg-backgroundColorMain hover:dark:bg-darkBlue "
                />
              </a>
            </Link>
            {/* Boards container */}
            <section className="text-fontSecondary w-[100%]">
              {/* All Boards title */}
              <h3 className="pl-4 uppercase font-bold text-xs mb-4">
                {boards?.length !== 0
                  ? `All Boards (${boards?.length})`
                  : "No Boards!"}
              </h3>
              {/* Boards subcontainer */}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="boardsSideNav">
                  {(provided: DroppableProvided, snapshot: any) => {
                    return (
                      // ref allows react-beautiful-dnd to control the div
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="overflow-auto"
                      >
                        {boards
                          ? boards.map(
                              // ** Re-assign board type later
                              (board: any, index: number) => {
                                return (
                                  <Draggable
                                    key={board.uid}
                                    draggableId={board.uid}
                                    index={index}
                                  >
                                    {(
                                      provided: DraggableProvided,
                                      snapshot: any
                                    ) => {
                                      return (
                                        // Single Board
                                        <div
                                          onClick={() => {
                                            setBoardId(board.uid);
                                          }}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`board rounded-r-full ${
                                            board.uid === boardId
                                              ? snapshot.isDragging
                                                ? " bg-fontTertiary bg-opacity-60 select-none text-fontPrimaryDark"
                                                : " bg-fontTertiary text-fontPrimaryDark opacity-100"
                                              : " active:bg-fontTertiary active:bg-opacity-60 active:text-fontPrimaryDark"
                                          }}`}
                                        >
                                          <TbLayoutBoardSplit />
                                          <input
                                            className="bg-transparent cursor-pointer outline-none"
                                            type="text"
                                            value={board.title}
                                            // ** Having trouble refactoring the logic in a separate func
                                            onChange={(e) => {
                                              updateBoardName(
                                                board.uid,
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </div>
                                      );
                                    }}
                                  </Draggable>
                                );
                              }
                            )
                          : "There is nothing bro :(!"}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </DragDropContext>
              {/* Create new Board container */}
              <div className="pl-4 flex justify-start items-center gap-3 py-1 text-fontTertiary cursor-pointer dark:hover:bg-fontPrimaryDark hover:bg-fontTertiary hover:bg-opacity-25 hover:rounded-r-full">
                <TbLayoutBoardSplit />
                <button onClick={handleCreateNewBoard}>
                  + Create New Board
                </button>
              </div>
            </section>
            {/* Log in/out btn + theme toggle + hide sidebar section */}
            <section className="mt-auto flex flex-col w-[100%]">
              {user && (
                <div className="flex justify-center items-center gap-4 mb-6">
                  <button
                    onClick={signOutUser}
                    className="purpleBtn w-fit px-6"
                  >
                    Log Out
                  </button>
                  <Image
                    className="w-8 h-8 rounded-full"
                    src={user?.photoURL || "hacker.png"}
                    height={32}
                    width={32}
                    alt="user photo"
                  />
                </div>
              )}
              {/* Theme toggle */}
              <div className="ml-4 mb-4 flex justify-center items-center gap-4 bg-backgroundColor2 dark:bg-darkBlue p-3 rounded">
                {/* Toggle light theme icon */}
                <HiSun className="text-fontPrimary dark:text-fontPrimaryDark w-5 h-5" />
                {/* Rectangle */}
                <div
                  onClick={toggleTheme}
                  className="h-6 w-12 bg-backgroundColorMenu dark:bg-fontTertiary rounded-full cursor-pointer flex justify-start dark:justify-end items-center m-0.5 px-0.5"
                >
                  {/* Circle */}
                  <div className="bg-fontTertiary dark:bg-fontPrimaryDark w-5 h-5 rounded-full"></div>
                </div>
                {/* Toggle dark theme icon */}
                <IoMdMoon className="text-fontPrimary dark:text-fontPrimaryDark w-5 h-5" />
              </div>
            </section>
          </nav>
        </div>
      ) : (
        <Link href="/">
          <nav className="h-full w-[12%] sm:w-[8%] lg:w-[8%] xl:w-[8%] bg-backgroundColorMenu dark:bg-darkGray">
            <a className="w-[100%] h-20 md:h-[88px] bg-backgroundColorMenu dark:bg-darkGray p-2 md:p-3 xl:p-4 flex justify-between items-center">
              <div className="hidden lg:flex justify-between items-center gap-[2px]">
                <div className="w-[5px] h-6 bg-fontTertiary rounded-md"></div>
                <div className="w-[6px] h-6 bg-fontTertiary rounded-md opacity-75"></div>
                <div className="w-[6px] h-6 bg-fontTertiary rounded-md opacity-50"></div>
              </div>
              <BiRightArrowAlt
                onClick={() => setIsOpen(true)}
                className="h-10 w-10 rounded text-darkBlue dark:text-backgroundColorMain hover:bg-backgroundColorMain hover:dark:bg-darkBlue cursor-pointer"
              />
            </a>
          </nav>
        </Link>
      )}
    </>
  );
};

export default SideNav;
