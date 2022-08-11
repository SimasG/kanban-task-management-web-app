import { User } from "firebase/auth";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { useContext } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";

const useFetchFsSharedBoards = () => {
  const user = useContext(UserContext);

  // ** 1. Fetch Users Doc + Extract sharedBoards
  const userRef = doc(db, "users", `${user?.uid}`);
  const sharedBoards = useDocumentData(userRef)[0]?.sharedBoards;
  if (!sharedBoards) return;
  console.log("sharedBoards:", sharedBoards);

  // ** Fetch Boards with the extracted boardIds (CollectionGroup query, where boardId
  // matches one of the extracted boardIds)

  const data = "zdare";

  return data;
};

export default useFetchFsSharedBoards;
