import { collection, query, where } from "firebase/firestore";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";

const useFetchFsTasks = (boardId: string | null | undefined) => {
  const user = useContext(UserContext);

  const columnsCollectionRef = collection(db, "users", `${user?.uid}`, "tasks");

  const q = query(columnsCollectionRef, where("board", "==", `${boardId}`));

  const tasks = useCollectionData(q)[0];

  const indexSortedTasks = tasks?.sort((a: any, b: any) => a.index - b.index);
  const statusIndexSortedTasks = indexSortedTasks?.sort(
    (a: any, b: any) => a.status - b.status
  );

  return statusIndexSortedTasks;
};

export default useFetchFsTasks;
