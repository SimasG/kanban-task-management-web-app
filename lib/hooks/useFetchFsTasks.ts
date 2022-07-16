import { collection, orderBy, query } from "firebase/firestore";
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
  const q = query(tasksCollectionRef);

  // const data = useCollectionData(collection(db, "users", `${uid}`, "boards"));
  const data = useCollectionData(q);

  // Why am I not receiving the array of data I want to fetch immediately
  // (aka why do I have to manually access the first array element to access the desired data)?
  return data[0];
};

export default useFetchFsTasks;
