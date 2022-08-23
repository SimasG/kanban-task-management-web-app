import {
  collection,
  DocumentData,
  Query,
  query,
  where,
} from "firebase/firestore";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";
import { ColumnSchema, SharedBoardRef, UserSchema } from "../types";

const useFetchFsColumns = (
  activeBoardId: string | null | undefined,
  users: UserSchema[] | undefined
) => {
  // User Object
  const user = useContext(UserContext);

  // Finding Current User Firebase Doc
  const currentUser = users?.find(
    (currentUser) => currentUser?.uid === user?.uid
  );

  let sharedBoardIds: (string | null | undefined)[] = [];
  currentUser?.sharedBoardRefs?.map((board) =>
    sharedBoardIds.push(board?.board)
  );

  let q: Query<DocumentData>;

  if (sharedBoardIds.includes(activeBoardId)) {
    // Fetch Columns from a shared Board
    const sharedBoardRef = currentUser?.sharedBoardRefs?.find(
      (board: SharedBoardRef) => board?.board === activeBoardId
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

  const columnData = useCollectionData(q)[0] as ColumnSchema[] | undefined;
  const sortedColumnData = columnData?.sort((a, b) => a.index - b.index);

  return sortedColumnData;
};

export default useFetchFsColumns;
