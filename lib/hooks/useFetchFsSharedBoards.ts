import { User } from "firebase/auth";
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useContext } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";

const useFetchFsSharedBoards = async () => {
  const user = useContext(UserContext);

  // ** 1. Fetch Users Doc + Extract shared Board ids
  const userRef = doc(db, "users", `${user?.uid}`);
  const sharedBoardIds = useDocumentData(userRef)[0]?.sharedBoards;
  if (!sharedBoardIds) return;
  // console.log("sharedBoardIds:", sharedBoardIds);

  // ** 2. Fetch Boards (CollectionGroup query, where boardId matches one of the extracted boardIds)
  const sharedBoardsQuery = query(
    // Collection Group Queries fetch any subcollections with the same name within the tree of nested documents
    // E.g. now we can run this query for posts without needing the username of every single user who posted
    collectionGroup(db, "boards"),
    where("collaborators", "array-contains-any", [`${user?.email}`])
  );

  const sharedBoards = (await getDocs(sharedBoardsQuery)).docs.map((doc: any) =>
    doc.data()
  );
  console.log("sharedBoards:", sharedBoards);

  return sharedBoards;
};

export default useFetchFsSharedBoards;
