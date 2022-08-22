import { collection, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import { UserSchema } from "../types";

const useFetchFsUsers = () => {
  // Fetch Users Collection
  const q = query(collection(db, "users"));

  const users = useCollectionData(q)?.[0] as UserSchema[];

  return users;
};

export default useFetchFsUsers;
