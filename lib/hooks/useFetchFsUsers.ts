import { collection, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

const useFetchFsUsers = () => {
  // Fetch Users Collection
  const q = query(collection(db, "users"));

  const data = useCollectionData(q)?.[0];

  return data;
};

export default useFetchFsUsers;
