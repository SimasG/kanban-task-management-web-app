import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  doc,
  increment,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import Image from "next/image";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { TbLayoutBoard, TbLayoutBoardSplit } from "react-icons/tb";
import { UserContext } from "../lib/context";
import { auth, db } from "../lib/firebase";
import { v4 as uuidv4 } from "uuid";
import useFetchFsBoards from "../lib/hooks/useFetchFsBoards";
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

// type LocalStorageDataProps = {
//   users: UserProps;
// };

// type UserProps = {
//   [key: string]: {
//     email: string;
//     id: string;
//     boards: BoardsProps[];
//   };
// };

// type BoardsProps = {
//   board: BoardProps;
// };

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
};

const SideNav = ({ boards, setBoards, boardId, setBoardId }: SideNavProps) => {
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
      const uuid = uuidv4();
      const ref = doc(db, "users", `${user?.uid}`, "boards", uuid);
      await setDoc(ref, {
        title: "New Board",
        uid: uuid,
        createdAt: Timestamp.fromDate(new Date()),
        index: boards?.length,
      });
      setBoardId(uuid);
    }
  };

  // U -> Firestore
  const updateBoardName = async (uid: string, newName: string) => {
    const ref = doc(db, "users", `${user?.uid}`, "boards", uid);
    await updateDoc(ref, {
      title: newName,
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      // ** this condition is only required for multi-column dnd
      //  destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    let add;
    let newBoards = boards;

    add = newBoards[source.index];

    // Removing Board from the array at source.index
    newBoards.splice(source.index, 1);

    // Adding the same Board in the array at destination.index
    newBoards.splice(destination.index, 0, add);

    // Reflecting UI changes in Firestore
    updateBoardIndex(
      newBoards[destination.index].uid,
      source.index,
      destination.index
    );

    // Changing the main Boards state
    setBoards(newBoards);
  };

  const updateBoardIndex = async (
    updatedBoardId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const batch = writeBatch(db);

    // ** Changing indexes of Boards affected
    boards?.map((board: any) => {
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
          const taskDocRef = doc(
            db,
            "users",
            `${user?.uid}`,
            "boards",
            `${board?.uid}`
          );
          batch.update(taskDocRef, { index: increment(1) });
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
      updatedAt: Timestamp.fromDate(new Date()),
    });
    console.log("end of func");
    await batch.commit();
  };

  return (
    <nav className="min-w-[250px] bg-darkGray pr-4 py-4 w-1/5 flex flex-col justify-between">
      {/* Logo container */}
      <a href="/" className="pl-4 flex justify-start items-center gap-2 mb-8">
        <TbLayoutBoard className="h-7 w-7" />
        <h1 className="text-3xl">kanban</h1>
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
                                          ? " bg-fontTertiary bg-opacity-60 select-none text-fontPrimary"
                                          : " bg-fontTertiary text-fontPrimary opacity-100"
                                        : " active:bg-fontTertiary active:bg-opacity-60 active:text-fontPrimary"
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
        <div className="pl-4 flex justify-start items-center gap-3 py-1 text-fontTertiary cursor-pointer hover:bg-fontPrimary hover:text-fontTertiary hover:rounded-r-full">
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
        <div className="ml-4 mb-4 flex justify-center items-center gap-4 bg-darkBlue p-3 rounded">
          {/* Toggle light theme icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0"
            ></path>
          </svg>
          {/* Rectangle */}
          <div className="h-5 w-10 bg-fontTertiary rounded-full cursor-pointer">
            {/* Circle */}
            <div></div>
          </div>
          {/* Toggle dark theme icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            ></path>
          </svg>{" "}
        </div>
        {/* Hide sidebar container */}
        <div className="pl-4 flex justify-start items-center gap-3 text-sm py-2 text-fontSecondary cursor-pointer hover:bg-darkBlue hover:text-fontPrimary hover:rounded-r-full">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            ></path>
          </svg>
          <h4>Hide Sidebar</h4>
        </div>
      </section>
    </nav>
  );
};

export default SideNav;
