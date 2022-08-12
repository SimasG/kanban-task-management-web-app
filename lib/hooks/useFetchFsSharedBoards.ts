// import {
//   collectionGroup,
//   doc,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import { useContext } from "react";
// import { useDocumentData } from "react-firebase-hooks/firestore";
// import { UserContext } from "../context";
// import { db } from "../firebase";

// const useFetchFsSharedBoards = async () => {
//   const user = useContext(UserContext);

//   const sharedBoardsQuery = query(
//     collectionGroup(db, "boards"),
//     where("collaborators", "array-contains-any", [`${user?.email}`])
//   );

//   const sharedBoards = (await getDocs(sharedBoardsQuery)).docs.map((doc: any) =>
//     doc.data()
//   );
//   // console.log("sharedBoards in useFetch hook:", sharedBoards);

//   return sharedBoards;
// };

// export default useFetchFsSharedBoards;

import {
  collection,
  collectionGroup,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UserContext } from "../context";
import { db } from "../firebase";

// WHen is uid null?
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
