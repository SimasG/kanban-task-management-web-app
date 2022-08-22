import { collection, DocumentData, query, where } from "firebase/firestore";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";
import { UserSchema } from "../types";

const useFetchFsTasks = (
  activeBoardId: string | null | undefined,
  users: UserSchema[] | undefined
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
  currentUser?.sharedBoardRefs?.map((board: any) =>
    sharedBoardIds.push(board?.board)
  );

  let q: any;

  if (sharedBoardIds.includes(activeBoardId)) {
    // Fetching Tasks from shared Board
    const sharedBoardRef = currentUser?.sharedBoardRefs?.find(
      (board: any) => board?.board === activeBoardId
    );
    const columnsCollectionRef = collection(
      db,
      "users",
      `${sharedBoardRef?.user}`,
      "tasks"
    );

    q = query(columnsCollectionRef, where("board", "==", `${activeBoardId}`));
  } else {
    // Fetching Tasks from personal Board
    const columnsCollectionRef = collection(
      db,
      "users",
      `${user?.uid}`,
      "tasks"
    );

    q = query(columnsCollectionRef, where("board", "==", `${activeBoardId}`));
  }

  const tasks = useCollectionData(q)[0];

  const indexSortedTasks = tasks?.sort((a: any, b: any) => a.index - b.index);
  const statusIndexSortedTasks = indexSortedTasks?.sort(
    (a: any, b: any) => a.status - b.status
  );

  // console.log("freshly fetched tasks:", statusIndexSortedTasks);

  return statusIndexSortedTasks;
};

export default useFetchFsTasks;
