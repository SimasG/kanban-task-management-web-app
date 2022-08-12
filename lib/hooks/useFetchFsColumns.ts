import { collection, query, where } from "firebase/firestore";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";

const useFetchFsColumns = (boardId: string | null | undefined) => {
  const user = useContext(UserContext);

  // ** Try to add logic for fetching Columns for either 1. Personal Board or 2. Shared Board

  // 1. Personal Board
  const columnsCollectionRef = collection(
    db,
    "users",
    `${user?.uid}`,
    "columns"
  );
  const q = query(columnsCollectionRef, where("board", "==", `${boardId}`));
  const columnData = useCollectionData(q)[0];
  const sortedColumnData = columnData?.sort(
    (a: any, b: any) => a.index - b.index
  );

  // 2. Shared Board
  // a) Get the userId of the inviter
  // b) Proceed with the same fetching logic

  return sortedColumnData;
};

export default useFetchFsColumns;
