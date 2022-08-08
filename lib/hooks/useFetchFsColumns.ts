import { collection, query, where } from "firebase/firestore";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";

const useFetchFsColumns = (boardId: string | null | undefined) => {
  const user = useContext(UserContext);

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

  return sortedColumnData;
};

export default useFetchFsColumns;
