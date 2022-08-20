import { collectionGroup, query, where } from "firebase/firestore";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";

const useFetchFsSharedBoards = () => {
  const user = useContext(UserContext);

  const sharedBoardsQuery = query(
    collectionGroup(db, "boards"),
    where("collaborators", "array-contains-any", [`${user?.email}`])
  );

  // Why am I not receiving the array of data I want to fetch immediately
  // (aka why do I have to manually access the first array element to access the desired data)?
  const data = useCollectionData(sharedBoardsQuery)[0];

  return data;
};

export default useFetchFsSharedBoards;
