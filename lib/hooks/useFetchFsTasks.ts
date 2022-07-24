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
    // "columns"
    "tasks"
  );

  const q = query(
    tasksCollectionRef
    // orderBy("status", "asc"),
    // orderBy("index", "asc")
  );

  // Why am I not receiving the array of data I want to fetch immediately
  // (aka why do I have to manually access the first array element to access the desired data)?
  const data = useCollectionData(q)[0];
  // console.log("data:", data);

  // const indexSortedData = data?.sort((a, b) => a.index - b.index);
  // const statusIndexSortedData = indexSortedData?.sort(
  //   (a, b) => a.status - b.status
  // );
  // console.log("statusIndexSortedData:", statusIndexSortedData);

  return data;
};

export default useFetchFsTasks;
