import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const useFetchTasksCollectionGroup = async (
  boardId: string | null | undefined
) => {
  let tasks: any = [];

  const tasksQ = query(
    collectionGroup(db, "tasks"),
    where("boardId", "==", `${boardId}`)
  );
  const querySnapshot = await getDocs(tasksQ);
  querySnapshot.forEach((doc) => {
    // console.log("doc.data():", doc.data());
    tasks?.push(doc.data());
  });

  console.log("Collection Group Tasks:", tasks);
};

export default useFetchTasksCollectionGroup;
