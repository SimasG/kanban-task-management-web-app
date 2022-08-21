import { collection, DocumentData, query, where } from "firebase/firestore";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";

const useFetchFsColumns = (
  activeBoardId: string | null | undefined,
  users: DocumentData[] | undefined
) => {
  // User Object
  const user = useContext(UserContext);

  // Finding Current User Firebase Doc
  const currentUser = users?.find(
    (currentUser: any) => currentUser.uid === user?.uid
  );

  let sharedBoardIds: any = [];
  currentUser?.sharedBoardRefs?.map((board: any) =>
    sharedBoardIds.push(board?.board)
  );

  let q: any;

  if (sharedBoardIds.includes(activeBoardId)) {
    // Fetch Columns from a shared Board
    const sharedBoardRef = currentUser?.sharedBoardRefs?.find(
      (board: any) => board?.board === activeBoardId
    );
    const columnsCollectionRef = collection(
      db,
      "users",
      `${sharedBoardRef?.user}`,
      "columns"
    );
    q = query(columnsCollectionRef, where("board", "==", `${activeBoardId}`));
  } else {
    // Fetch Columns from a personal Board
    const columnsCollectionRef = collection(
      db,
      "users",
      `${user?.uid}`,
      "columns"
    );
    q = query(columnsCollectionRef, where("board", "==", `${activeBoardId}`));
  }

  const columnData = useCollectionData(q)[0];
  const sortedColumnData = columnData?.sort(
    (a: any, b: any) => a.index - b.index
  );

  return sortedColumnData;
};

export default useFetchFsColumns;
