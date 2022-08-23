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

const useFetchColumns = (
  activeBoardId: string | null | undefined,
  currentUserDoc: UserSchema
) => {
  // User Object
  const user = useContext(UserContext);

  // // Finding Current User Firebase Doc
  // const currentUser = users?.find(
  //   (currentUser) => currentUser?.uid === user?.uid
  // );

  let sharedBoardIds: (string | null | undefined)[] = [];
  currentUserDoc?.sharedBoardRefs?.map((sharedBoardRef: SharedBoardRef) =>
    sharedBoardIds.push(sharedBoardRef?.board)
  );

  let q: Query<DocumentData>;

  if (sharedBoardIds.includes(activeBoardId)) {
    // Fetch Columns from a shared Board
    const sharedBoardRef = currentUserDoc?.sharedBoardRefs?.find(
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

  const columnData = useCollectionData(q)[0];
  const sortedColumnData = columnData?.sort((a, b) => a?.index - b?.index) as
    | ColumnSchema[];

  return sortedColumnData;
};

export default useFetchColumns;
