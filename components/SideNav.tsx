import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  doc,
  increment,
  serverTimestamp,
  setDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import Image from "next/image";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { TbLayoutBoardSplit } from "react-icons/tb";
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
  ResponderProvided,
} from "react-beautiful-dnd";
import { BoardSchema } from "../lib/types";
import { defaultColumns } from "../lib/helpers";

type LocalStorageBoardSchema = {
  boards: {
    title: string;
    uid: string;
    createdAt: any;
  }[];
};

type SideNavProps = {
  boards: any;
  setBoards: React.Dispatch<React.SetStateAction<any>>;
  boardId: string | null | undefined;
  setBoardId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  updateBoardName: (uid: string, newName: string) => Promise<void>;
};

const SideNav = ({
  boards,
  setBoards,
  boardId,
  setBoardId,
  updateBoardName,
}: SideNavProps) => {
  const user = useContext(UserContext);

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        // Creating user doc if it doesn't exist already
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          timeStamp: serverTimestamp(),
        });

        //
        // if (localStorage.getItem("boards") || "" !== "") {
        if (
          localStorage.getItem("boards") !== "[]" ||
          localStorage.getItem("boards") !== null
        ) {
          const lsData = JSON.parse(localStorage.getItem("boards") || "");
          lsData?.forEach(async (board: BoardSchema) => {
            const ref = doc(
              db,
              "users",
              `${user.uid}`,
              "boards",
              `${board.uid}`
            );
            await setDoc(ref, board);
          });
        }
        // Clearing localStorage as soon as user is authed. LS is designed to be a temporary DB only.
        localStorage.clear();
        toast.success(`Welcome ${user.displayName}!`);
      })
      .catch((err) => console.log(err));
  };

  const signOutUser = () => {
    setBoards(null);
    signOut(auth).then(() => toast.success("Logged out!"));
  };

  const handleCreateNewBoard = async () => {
    // Creating new Board in localStorage
    if (!user) {
      // If LS isn't empty (empty array OR empty string OR null)
      if (
        localStorage.getItem("boards") !== "[]" &&
        localStorage.getItem("boards") !== null
      ) {
        const oldData = JSON.parse(localStorage.getItem("boards") || "");
        const newData = [
          ...oldData,
          {
            uid: uuidv4(),
            title: "New Board",
            createdAt: Date.now(),
            // Add index (similar to "index: parseInt(oldData?.length)")
          },
        ];
        localStorage.setItem("boards", JSON.stringify(newData));
        if (
          JSON.parse(localStorage.getItem("boards") || "")?.[0]?.createdAt <
          JSON.parse(localStorage.getItem("boards") || "")?.[1]?.createdAt
        ) {
          setBoards(newData);
        } else {
          setBoards(newData);
        }

        setBoardId(newData?.[0]?.uid);
      }
      // If LS is empty
      else {
        const newData = [
          {
            uid: uuidv4(),
            title: "New Board",
            createdAt: Date.now(),
            // Add index (similar to "index: parseInt(oldData?.length)")
          },
        ];
        localStorage.setItem("boards", JSON.stringify(newData));
        setBoards(newData);
        setBoardId(newData?.[0]?.uid);
      }
    } else {
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
        console.log("default column:", column);
        const columnRef = doc(
          db,
          "users",
          `${user?.uid}`,
          "boards",
          `${uuid}`,
          "columns",
          `${column?.uid}`
        );
        batch.set(columnRef, {
          uid: column?.uid,
          index: column?.index,
          status: column?.status,
          title: column?.title,
          color: column?.color,
        });
      });
      await batch.commit();
    }
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

    // Changing the main Boards state
    setBoards(newBoards);
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
          console.log("board to be decremented:", board);
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
          console.log("board to be incremented:", board);
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
    <nav className="min-w-[250px] bg-backgroundColorMenu dark:bg-darkGray pr-4 py-4 w-[15%] flex flex-col justify-between">
      {/* Logo container */}
      <a href="/" className="pl-4 flex justify-start items-center gap-2 mb-8">
        {/* Logo */}
        <div className="flex justify-between items-center gap-[2px]">
          <div className="w-[5px] h-6 bg-fontTertiary rounded-md"></div>
          <div className="w-[6px] h-6 bg-fontTertiary rounded-md opacity-75"></div>
          <div className="w-[6px] h-6 bg-fontTertiary rounded-md opacity-50"></div>
        </div>
        <h1 className="text-3xl text-fontPrimary dark:text-fontPrimaryDark">
          kanban
        </h1>
      </a>
      {/* Boards container */}
      <section className="text-fontSecondary">
        {/* All Boards title */}
        <h3 className="pl-4 uppercase font-bold text-xs mb-4">
          {/* Would like to change the initial "undefined" value of "localStorageBoards?.boards?.length" */}
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
                <div {...provided.droppableProps} ref={provided.innerRef}>
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
                              {(provided: DraggableProvided, snapshot: any) => {
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
                                      onChange={
                                        user
                                          ? // If user is authenticated, update Firestore
                                            (e) => {
                                              updateBoardName(
                                                board.uid,
                                                e.target.value
                                              );
                                              // setLocalStorageBoards(newBoardList);
                                              // setBoardId(board?.id);
                                            }
                                          : // If user is not authenticated, update localStorage
                                            (e) => {
                                              const newBoardList: {}[] = [];
                                              boards.map((b: BoardSchema) => {
                                                b.uid === board.uid
                                                  ? newBoardList.push({
                                                      ...board,
                                                      title: e.target.value,
                                                    })
                                                  : newBoardList.push(b);
                                              });
                                              localStorage.setItem(
                                                "boards",
                                                JSON.stringify(newBoardList)
                                              );
                                              setBoards(newBoardList);
                                              setBoardId(board.uid);
                                            }
                                      }
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
          <button onClick={handleCreateNewBoard}>+ Create New Board</button>
        </div>
      </section>
      {/* Log in/out btn + theme toggle + hide sidebar section */}
      <section className="mt-auto flex flex-col">
        {user ? (
          <div className="flex justify-center items-center gap-4 mb-6">
            <button onClick={signOutUser} className="purpleBtn w-fit px-6">
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
        ) : (
          <button
            onClick={handleGoogleLogin}
            className="purpleBtn w-fit mx-auto mb-6 px-6 flex justify-center items-center gap-4"
          >
            <span>Log In</span>
            <FcGoogle className="w-6 h-6" />
          </button>
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
  );
};

export default SideNav;
