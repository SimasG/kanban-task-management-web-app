import { useEffect, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import Collaborators from "../Collaborators";
import { BoardSchema, UserSchema } from "../../lib/types";

type MainProps = {
  activeBoard: BoardSchema;
  activeBoardId: string | null | undefined;
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateBoardName: (uid: string, newName: string) => Promise<void>;
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
  sharedBoardIds: (string | null | undefined)[];
  handleDeleteBoard: (
    activeBoardId: string | null | undefined
  ) => Promise<void>;
  users: UserSchema[]; // *TypeScript* Why can I use "UserSchema[]" this time tho?
  allBoards: BoardSchema[];
};

const TopSettings = ({
  activeBoard,
  activeBoardId,
  setShowAddTaskModal,
  updateBoardName,
  setShowShareModal,
  sharedBoardIds,
  handleDeleteBoard,
  users,
  allBoards,
}: MainProps) => {
  const [readOnlyState, setReadOnlyState] = useState(false);

  useEffect(() => {
    activeBoard?.title ? setReadOnlyState(false) : setReadOnlyState(true);
  }, [activeBoard]);

  const handleAddNewTaskBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowAddTaskModal(true);
  };

  const handleShareBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowShareModal(true);
  };

  return (
    <section
      className={`h-[10%] w-[100%] p-4 flex justify-between items-center bg-backgroundColorMenu dark:bg-darkGray`}
    >
      <input
        className="read-only text-lg sm:text-xl bg-transparent cursor-pointer outline-none text-fontPrimary dark:text-fontPrimaryDark w-[140px] md:w-[40%]"
        type="text"
        readOnly={readOnlyState}
        value={activeBoard?.title || "Future Board Title 🤓"}
        onChange={(e) => {
          updateBoardName(activeBoard?.uid, e.target.value);
        }}
      />
      {allBoards?.length > 0 && (
        <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
          {/* Displaying Collaborators */}
          {activeBoard?.collaborators?.length > 0 && (
            <Collaborators activeBoard={activeBoard} users={users} />
          )}
          {/* Desktop Add New Task Btn */}
          <button
            onClick={(e) => {
              handleAddNewTaskBtn(e);
            }}
            className="purpleBtn hidden text-xs px-2 drop-shadow-lg hover:drop-shadow-xl md:px-3 lg:px-4 sm:block md:text-sm lg:text-base"
          >
            + New Task
          </button>
          {/* Share Btn */}
          {!sharedBoardIds.includes(activeBoardId) && (
            <button
              onClick={(e) => handleShareBtn(e)}
              className="bg-fontPrimaryDark dark:hover:bg-fontTertiary text-fontTertiary dark:hover:text-fontPrimaryDark font-bold rounded-full py-2 px-2 md:px-3 lg:px-4 drop-shadow-lg hover:drop-shadow-xl flex justify-between items-center gap-1 text-xs md:text-sm lg:text-base"
            >
              <AiOutlineUserAdd />
              <p>Share</p>
            </button>
          )}
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
          {!sharedBoardIds.includes(activeBoardId) && (
            <svg
              onClick={() => handleDeleteBoard(activeBoardId)}
              className="w-10 h-10 p-2 text-fontSecondary rounded cursor-pointer hover:bg-backgroundColorMain hover:dark:bg-darkBlue"
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
          )}
        </div>
      )}
    </section>
  );
};

export default TopSettings;
