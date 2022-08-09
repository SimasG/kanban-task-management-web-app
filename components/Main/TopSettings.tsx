import { doc, increment, writeBatch } from "firebase/firestore";
import { useContext } from "react";
import { UserContext } from "../../lib/context";
import { db } from "../../lib/firebase";
import { AiOutlineUserAdd } from "react-icons/ai";

type TopSettingsProps = {
  activeBoard: any;
  boards: any;
  boardId: string | null | undefined;
  setBoardId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateBoardName: (uid: string, newName: string) => Promise<void>;
  columns: any;
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const TopSettings = ({
  activeBoard,
  boards,
  boardId,
  setBoardId,
  setShowAddTaskModal,
  updateBoardName,
  columns,
  setShowShareModal,
}: TopSettingsProps) => {
  const user = useContext(UserContext);

  const handleAddNewTaskBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowAddTaskModal(true);
  };

  const handleShareBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowShareModal(true);
  };

  // ** FIXED
  const handleDeleteBoard = async (uid: string | null | undefined) => {
    const batch = writeBatch(db);
    // Delete Board
    const boardDocRef = doc(db, "users", `${user?.uid}`, "boards", `${uid}`);
    // If the first Board in the array is deleted, setId to the second Board (which will become the
    // first once the first one is removed from FS). Else, remove the first Board in the array.
    boards?.[0]?.uid === uid
      ? setBoardId(boards?.[1]?.uid)
      : setBoardId(boards?.[0]?.uid);
    batch.delete(boardDocRef);

    // Delete Columns in the Board
    const columnsToDelete = columns?.filter(
      (column: any) => column?.board === uid
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

    // Decrement indexes of Boards that come after deleted Board
    boards?.map((board: any) => {
      if (board?.index <= activeBoard?.[0]?.index) return;
      const boardDocRef = doc(
        db,
        "users",
        `${user?.uid}`,
        "boards",
        `${board?.uid}`
      );
      batch.update(boardDocRef, { index: increment(-1) });
    });
    await batch.commit();
  };

  return (
    <section
      className={`h-[10%] w-[100%] p-4 flex justify-between items-center bg-backgroundColorMenu dark:bg-darkGray`}
    >
      <input
        className="text-xl bg-transparent cursor-pointer outline-none text-fontPrimary dark:text-fontPrimaryDark sm:w-[140px] md:w-[40%]"
        type="text"
        value={activeBoard?.[0]?.title || "Future Board Title 🤓"}
        onChange={(e) => {
          updateBoardName(activeBoard?.[0]?.uid, e.target.value);
        }}
      />
      {boards?.length > 0 && (
        <div className="flex justify-center items-center gap-2 md:gap-3 lg:gap-4">
          {/* Desktop Add New Task Btn */}
          <button
            onClick={(e) => {
              handleAddNewTaskBtn(e);
            }}
            className="purpleBtn hidden text-xs px-2 md:px-3 lg:px-4 sm:block md:text-sm lg:text-base"
          >
            + New Task
          </button>
          {/* Share Btn */}
          <button
            onClick={(e) => handleShareBtn(e)}
            className="bg-fontPrimaryDark dark:hover:bg-fontTertiary text-fontTertiary dark:hover:text-fontPrimaryDark font-bold rounded-full py-2 px-2 md:px-3 lg:px-4 drop-shadow-lg hover:drop-shadow-xl flex justify-between items-center gap-1 text-xs md:text-sm lg:text-base"
          >
            <AiOutlineUserAdd />
            <p>Share</p>
          </button>
          {/* Mobile Add New Task Btn */}
          <button
            onClick={(e) => {
              handleAddNewTaskBtn(e);
            }}
            className="absolute right-4 bottom-4 purpleBtn text-6xl h-20 w-20 p-0 flex justify-center items-center sm:hidden sm:text z-50"
          >
            <span className="relative bottom-[3px]">+</span>
          </button>
          {/* Delete Board Btn */}
          <svg
            onClick={() => handleDeleteBoard(boardId)}
            className="w-12 h-12 sm:w-10 sm:h-10 p-2 text-fontSecondary rounded cursor-pointer hover:bg-backgroundColorMain hover:dark:bg-darkBlue"
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
      )}
    </section>
  );
};

export default TopSettings;
