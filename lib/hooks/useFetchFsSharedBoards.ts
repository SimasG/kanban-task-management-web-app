import { User } from "firebase/auth";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { useContext } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";

// WHen is uid null?
const useFetchFsSharedBoards = () => {
  const user = useContext(UserContext);

  // 1. if (!sharedBoards) return;
  // 2. Extract boardIds from sharedBoards
  // 3. Fetch Boards with the extracted boardIds (CollectionGroup query, where boardId
  // matches one of the extracted boardIds)

  // ** 1. Fetch Users Doc
  const userRef = doc(db, "users", `${user?.uid}`);

  const userDoc = useDocumentData(userRef)[0];
  console.log("userDoc:", userDoc);

  const data = "zdare";

  return data;
};

export default useFetchFsSharedBoards;
