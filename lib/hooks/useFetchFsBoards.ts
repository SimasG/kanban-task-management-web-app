import { collection, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

// WHen is uid null?
const useFetchFsBoards = (uid: string | null | undefined) => {
  const q = query(
    collection(db, "users", `${uid}`, "boards"),
    orderBy("index", "asc")
  );

  // Why am I not receiving the array of data I want to fetch immediately
  // (aka why do I have to manually access the first array element to access the desired data)?
  const data = useCollectionData(q)[0];

  return data;
};

export default useFetchFsBoards;
