import { collection, DocumentData, query, where } from "firebase/firestore";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";

const useFetchFsTasks = (
  boardId: string | null | undefined,
  users: DocumentData[] | undefined
) => {
  // User Object
  const user = useContext(UserContext);

  // Finding Current User Firebase Doc
  const currentUser = users?.find(
    (currentUser: any) => currentUser.uid === user?.uid
  );

  // Utilising sharedBoardIds & sharedBoards (Boards current user has been invited to)
  // array to fetch the correct Tasks
  let sharedBoardIds: any = [];
  currentUser?.sharedBoards?.map((board: any) =>
    sharedBoardIds.push(board?.board)
  );

  let q: any;

  if (sharedBoardIds.includes(boardId)) {
    // Fetching Tasks from shared Board
    const sharedBoard = currentUser?.sharedBoards?.find(
      (board: any) => board?.board === boardId
    );
    const columnsCollectionRef = collection(
      db,
      "users",
      `${sharedBoard?.user}`,
      "tasks"
    );

    q = query(columnsCollectionRef, where("board", "==", `${boardId}`));
  } else {
    // Fetching Tasks from personal Board
    const columnsCollectionRef = collection(
      db,
      "users",
      `${user?.uid}`,
      "tasks"
    );

    q = query(columnsCollectionRef, where("board", "==", `${boardId}`));
  }

  const tasks = useCollectionData(q)[0];

  const indexSortedTasks = tasks?.sort((a: any, b: any) => a.index - b.index);
  const statusIndexSortedTasks = indexSortedTasks?.sort(
    (a: any, b: any) => a.status - b.status
  );

  return statusIndexSortedTasks;
};

export default useFetchFsTasks;
