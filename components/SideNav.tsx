import { signOut } from "firebase/auth";
import { doc, increment, Timestamp, writeBatch } from "firebase/firestore";
import Image from "next/image";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { TbLayoutBoardSplit } from "react-icons/tb";
import { BiRightArrowAlt, BiLeftArrowAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
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
import { Popover } from "@mantine/core";
import Demo from "./Demo";

type SideNavProps = {
  boards: any;
  boardId: string | null | undefined;
  setBoardId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  updateBoardName: (uid: string, newName: string) => Promise<void>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sharedBoards: any;
};

const SideNav = ({
  boards,
  sharedBoards,
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
      const columnUid = uuidv4();
      const columnRef = doc(
        db,
        "users",
        `${user?.uid}`,
        "columns",
        `${columnUid}`
      );
      batch.set(columnRef, {
        uid: columnUid,
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
    const { source, destination, type } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    let add;

    if (type === "personalBoards") {
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
    } else if (type === "sharedBoards") {
      let newBoards = sharedBoards;
      add = newBoards[source.index];
      // Removing Board from the array at source.index
      newBoards.splice(source.index, 1);
      // Adding the same Board in the array at destination.index
      newBoards.splice(destination.index, 0, add);
      // Not reflecting UI changes in Firestore since the shared Boards do not belong to the invitee
    }
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
          className="z-50 absolute bg-black bg-opacity-50 top-0 left-0 w-full h-screen flex justify-center items-center rounded-r sm:static sm:bg-transparent sm:bg-opacity-100 sm:inset-auto sm:block sm:w-[40%] md:w-[35%] lg:w-[25%] xl:w-[20%]"
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
            {/* <Demo /> */}
            {/* Boards Container */}
            <DragDropContext onDragEnd={onDragEnd}>
              <section className="w-[100%] flex flex-col justify-center items-start gap-6">
                {/* Personal Boards Container */}
                <div className="w-[100%] text-fontSecondary">
                  {/* Personal Boards title */}
                  <h3 className="pl-4 uppercase font-bold text-xs mb-4">
                    {boards?.length !== 0
                      ? `All Boards (${boards?.length})`
                      : "No Boards!"}
                  </h3>
                  {/* Personal Boards Subcontainer */}
                  <Droppable droppableId="personalBoards" type="personalBoards">
                    {(provided: DroppableProvided, snapshot: any) => {
                      return (
                        // ref allows react-beautiful-dnd to control the div
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="overflow-auto"
                        >
                          {boards
                            ? boards.map((board: any, index: number) => {
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
                                                ? " bg-fontTertiary bg-opacity-60 select-none text-fontPrimaryDark drop-shadow-lg hover:drop-shadow-xl"
                                                : " bg-fontTertiary text-fontPrimaryDark opacity-100 drop-shadow-lg hover:drop-shadow-xl"
                                              : " active:bg-fontTertiary active:bg-opacity-60 active:text-fontPrimaryDark"
                                          }}`}
                                        >
                                          <TbLayoutBoardSplit className="shrink-0" />
                                          <input
                                            className="bg-transparent cursor-pointer outline-none w-[80%] grow"
                                            type="text"
                                            value={board.title}
                                            onChange={(e) => {
                                              updateBoardName(
                                                board.uid,
                                                e.target.value
                                              );
                                            }}
                                          />
                                          <Popover
                                            // (alias) type FloatingPosition = "left-end" | FloatingSide | "bottom-end"
                                            // | "bottom-start" | "left-start" | "right-end" | "right-start" |
                                            // "top-end" | "top-start"
                                            position="top-end"
                                            shadow="md"
                                          >
                                            <Popover.Target>
                                              <BsThreeDots className="shrink-0 w-6 h-6 p-1 hover:bg-[#7c78d2] rounded cursor-pointer" />
                                            </Popover.Target>
                                            <Popover.Dropdown>
                                              <div className="w-[100%] hover:bg-[#eef2f7]">
                                                <button className="block p-2 text-fontPrimary">
                                                  Remove Collaborators
                                                </button>
                                              </div>
                                              <div className="w-[100%] hover:bg-[#eef2f7]">
                                                <button className="block p-2 text-fontPrimary">
                                                  Delete Board
                                                </button>
                                              </div>
                                              <div className="w-[100%] hover:bg-[#eef2f7]">
                                                <button className="block p-2 text-fontPrimary">
                                                  Leave Board
                                                </button>
                                              </div>
                                            </Popover.Dropdown>
                                          </Popover>
                                          {/* <BsThreeDots className="shrink-0 w-6 h-6 p-1 hover:bg-[#7c78d2] rounded cursor-pointer" /> */}

                                          {/* <Popover width={200} position="bottom" withArrow shadow="md">
                                        <Popover.Target>

                                          <BsThreeDots className="shrink-0 w-6 h-6 p-1 hover:bg-[#7c78d2] rounded cursor-pointer" />
                                        </Popover.Target>
                                        <Popover.Dropdown>
                                        <Text size="sm">This is uncontrolled popover, it is opened when button is clicked</Text>

                                        </Popover.Dropdown>
                                        </Popover> */}
                                        </div>
                                      );
                                    }}
                                  </Draggable>
                                );
                              })
                            : "There is nothing bro :(!"}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                  {/* Create new Board container */}
                  <div className="pl-4 flex justify-start items-center gap-3 py-1 text-fontTertiary cursor-pointer dark:hover:bg-fontPrimaryDark hover:bg-fontTertiary hover:bg-opacity-25 hover:rounded-r-full">
                    <TbLayoutBoardSplit />
                    <button onClick={handleCreateNewBoard}>
                      + Create New Board
                    </button>
                  </div>
                </div>
                {/* Shared Boards Container */}
                {sharedBoards && (
                  <div className="w-[100%] text-fontSecondary">
                    {/* Shared Boards title */}
                    <h3 className="pl-4 uppercase font-bold text-xs mb-4">
                      {`Shared Boards (${sharedBoards?.length})`}
                    </h3>
                    <Droppable droppableId="sharedBoards" type="sharedBoards">
                      {(provided: DroppableProvided, snapshot: any) => {
                        return (
                          // ref allows react-beautiful-dnd to control the div
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="overflow-auto"
                          >
                            {sharedBoards.map((board: any, index: number) => {
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
                                              ? " bg-fontTertiary bg-opacity-60 select-none text-fontPrimaryDark drop-shadow-lg hover:drop-shadow-xl"
                                              : " bg-fontTertiary text-fontPrimaryDark opacity-100 drop-shadow-lg hover:drop-shadow-xl"
                                            : " active:bg-fontTertiary active:bg-opacity-60 active:text-fontPrimaryDark"
                                        }}`}
                                      >
                                        <TbLayoutBoardSplit />
                                        <input
                                          className="bg-transparent cursor-pointer outline-none"
                                          type="text"
                                          value={board.title}
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
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                )}
              </section>
            </DragDropContext>
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
