import { collection, query } from "firebase/firestore";
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
    "boards",
    `${boardId}`,
    "columns"
  );

  const q = query(columnsCollectionRef);

  const columnData = useCollectionData(q)[0];

  return columnData;
};

export default useFetchFsColumns;
