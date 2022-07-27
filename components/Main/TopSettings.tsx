import { deleteDoc, doc, increment, writeBatch } from "firebase/firestore";
import { useContext } from "react";
import { UserContext } from "../../lib/context";
import { db } from "../../lib/firebase";
import { BoardSchema } from "../../lib/types";

type TopSettingsProps = {
  activeBoard: any;
  boards: any;
  setBoards: React.Dispatch<any>;
  boardId: string | null | undefined;
  setBoardId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setShowAddTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateBoardName: (uid: string, newName: string) => Promise<void>;
};

const TopSettings = ({
  activeBoard,
  boards,
  setBoards,
  boardId,
  setBoardId,
  setShowAddTaskModal,
  updateBoardName,
}: TopSettingsProps) => {
  // ** Fetching Data
  const user = useContext(UserContext);

  const handleAddNewTaskBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowAddTaskModal(true);
  };

  const handleDeleteBoard = async (uid: string | null | undefined) => {
    // Deleting Board from localStorage
    if (!user) {
      const lsData = JSON.parse(localStorage.getItem("boards") || "");
      const newData = lsData.filter((board: BoardSchema) => board.uid !== uid);
      localStorage.setItem("boards", JSON.stringify(newData));
      setBoards(newData);
      setBoardId(newData?.[0]?.uid);
    } else {
      const batch = writeBatch(db);

      const activeBoard = boards?.filter(
        (board: any) => board?.uid === boardId
      );

      // Delete Board
      const boardDocRef = doc(db, "users", `${user?.uid}`, "boards", `${uid}`);
      // If the first Board in the array is deleted, setId to the second Board (which will become the
      // first once the first one is removed from FS). Else, remove the first Board in the array.
      boards?.[0]?.uid === uid
        ? setBoardId(boards?.[1]?.uid)
        : setBoardId(boards?.[0]?.uid);
      batch.delete(boardDocRef);

      // Decrement indexes of Boards that come after deleted Board
      boards?.map((board: any) => {
        if (board?.index <= activeBoard?.[0]?.index) return;
        console.log(`Board to be decremented:`, board);
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
    }
  };

  return (
    <section className="h-[10%] min-w-[500px] p-4 flex justify-between items-center bg-darkGray">
      <input
        className="text-2xl bg-transparent cursor-pointer outline-none"
        type="text"
        value={
          (activeBoard && activeBoard?.[0]?.title) || "Future Board Name 🤓"
        }
        onChange={
          user
            ? // If user is authenticated, update Firestore
              (e) => {
                updateBoardName(activeBoard?.[0]?.uid, e.target.value);
              }
            : // If user is not authenticated, update localStorage
              (e) => {
                const newBoardList: {}[] = [];
                boards.map((b: BoardSchema) => {
                  b.uid === activeBoard?.[0]?.id
                    ? newBoardList.push({
                        ...activeBoard?.[0],
                        title: e.target.value,
                      })
                    : newBoardList.push(b);
                });
                localStorage.setItem("boards", JSON.stringify(newBoardList));
                setBoards(newBoardList);
                setBoardId(activeBoard?.[0]?.id);
              }
        }
      />
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={(e) => {
            handleAddNewTaskBtn(e);
          }}
          className="px-4 purpleBtn"
        >
          + Add New Task
        </button>
        {/* Delete Board Btn */}
        <svg
          onClick={() => handleDeleteBoard(boardId)}
          className="w-10 h-10 p-2 text-fontSecondary rounded cursor-pointer hover:bg-darkBlue"
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
    </section>
  );
};

export default TopSettings;
