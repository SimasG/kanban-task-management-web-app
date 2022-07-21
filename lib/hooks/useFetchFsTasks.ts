import { collection, orderBy, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

const useFetchFsTasks = (
  userId: string | null | undefined,
  boardId: string | null | undefined
) => {
  const tasksCollectionRef = collection(
    db,
    "users",
    `${userId}`,
    "boards",
    `${boardId}`,
    "tasks"
  );
  const q = query(tasksCollectionRef, orderBy("status", "asc"));

  const data = useCollectionData(q);
  // console.log(data);

  // Why am I not receiving the array of data I want to fetch immediately
  // (aka why do I have to manually access the first array element to access the desired data)?
  return data[0];
};

export default useFetchFsTasks;
