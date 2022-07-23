import { collection, orderBy, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

const useFetchFsTasksTest = (
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

  const data = useCollectionData(q)[0];

  // const testQ = query(tasksCollectionRef);
  // const testData = useCollectionData(testQ)[0];
  // console.log(testData);

  // const todoQ = query(tasksCollectionRef, where("status", "==", "todo"));
  // const doingQ = query(tasksCollectionRef, where("status", "==", "doing"));
  // const doneQ = query(tasksCollectionRef, where("status", "==", "done"));

  // const todoData: any = useCollectionData(todoQ);
  // const doingData: any = useCollectionData(doingQ);
  // const doneData: any = useCollectionData(doneQ);

  // let data;
  // if (todoData[0] && doingData[0] && doneData[0]) {
  //   data = [...todoData?.[0], ...doingData?.[0], ...doneData?.[0]];
  // }

  // Why am I not receiving the array of data I want to fetch immediately
  // (aka why do I have to manually access the first array element to access the desired data)?
  return data;
};

export default useFetchFsTasksTest;
